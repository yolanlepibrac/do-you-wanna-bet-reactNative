

import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image } from 'react-native';
import { connect } from "react-redux";

import API from '../Utils/API';
import Utils from '../Utils/Utils';
import Signup from './Signup';
import Login from './Login';

import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

//Redux
import { changeAccountState } from "../Redux/Actions/index";
import { getUserFriends } from "../Redux/Actions/index";
import { getUserBets } from "../Redux/Actions/index";
import { getUserWitnessOf } from "../Redux/Actions/index";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    getUserBets: (tabOfBets) => dispatch(getUserBets(tabOfBets)),
    getUserFriends: (tabOfFriends) => dispatch(getUserFriends(tabOfFriends)),
    getUserWitnessOf: (tabOfWitnessOf) => dispatch(getUserWitnessOf(tabOfWitnessOf)),
  };
};



class NoAccountComponent extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      popupConnexion : false,
      popupSignUp : false,
      displayLoading :false,
      email : "",
      userName: "",
      password: "",
      cpassword: "",
      imageProfil:"",
    };
  }


  toggleLoginPopup = () => {
    this.setState({
      popupConnexion:!this.state.popupConnexion,
      popupSignUp : false,
    })
  }

  toggleRegisterPopup = () => {
    this.setState({
      popupSignUp:!this.state.popupSignUp,
      popupConnexion : false,
    })
  }

  quitLoginAndSignUp = () => {
    this.setState({
      popupConnexion : false,
      popupSignUp : false,
    })
  }

  displayLoading = (boolean) => {
    this.setState({displayLoading:boolean})
  }




  componentDidMount = () => {
    //this.props.navigation.navigate("TopNavigation", {email:emailStored})
    AsyncStorage.getItem('email').then((emailStored) => {
      if(emailStored){
        Utils.loginAlreadyConnected(emailStored, this, () => {
          this.props.navigation.navigate("TopNavigation", {email:emailStored});
          this.stayLog(emailStored)
        })
      }
    })
  }

  stayLog = async email => {
    try {
      await AsyncStorage.setItem('email', email);
    } catch (error) {
      console.log(error.message);
    }
  }

  login = (email, password) => {
    this.setState({displayLoading:true})
    API.login(email, password).then((dataUser)=>{
      console.log(dataUser.data)
      this.props.changeAccountState(dataUser.data.user.userData);
      this.props.getUserFriends(dataUser.data.user.friends);
      this.props.getUserBets(dataUser.data.user.bets);
      this.props.getUserWitnessOf(dataUser.data.user.witnessOf);
      this.stayLog(dataUser.data.user.userData.email)
      this.props.navigation.navigate("TopNavigation", {email:email})
      this.setState({displayLoading:false})
    }).catch(error => {
        this._showAlert('Error', "Error, please check your connexion")
        console.log(error)
        this.setState({displayLoading:false})
    });
  }






  signup = (email, userName, imageProfil, password, cpassword) => {
    this.setState({displayLoading:true})
    if(userName.length === 0 || email.length === 0 || imageProfil.length === 0 || password.length === 0 || (password !== cpassword)){
      this.setState({displayLoading:false})
    }
    if(userName.length === 0){
      this._showAlert('Error', "Please choose a user name")
      return;
    }
    if(email.length === 0){
      this._showAlert('Error', "Please fill your email")
      return;
    }
    if(imageProfil.length === 0){
      this._showAlert('Error', "Please pick a profile picture")
      return;
    }
    if(password.length === 0 || password !== cpassword){
      this._showAlert('Error', "Carefull, password and confirm password does not match or are invalid")
      return;
    }
    var _send = {
        id:'_' + Math.random().toString(36).substr(2, 9),
        email: email,
        userName: userName,
        password: password,
        imageProfil: imageProfil,
        bets:[],
        witnessOf:[],
        friends:[],
    }

    API.signup(_send).then((data) => {
      if(data.status === 200){
        this.props.changeAccountState(data.data.userData);
        this.props.getUserFriends([]);
        this.props.getUserBets([]);
        this.props.getUserWitnessOf([]);
        this.props.navigation.navigate("FriendsContainer", {email:data.data.userData.email})
        this._showAlert('Information', "Add friends to make your first bet !")
        this.stayLog(data.data.userData.email)
        this.setState({displayLoading:false});
      }else if(data.status === 204){
        this._showAlert('Error', "This email is already used")
        this.setState({displayLoading:false})
      }
    },(error) => {
        this._showAlert('Error', "error with server")
        console.log(error)
        this.setState({displayLoading:false});
    })
  }


  _showAlert = (title, errorMessage) => {
    Alert.alert(
      title,
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  changeState = (key, value) => {
    this.setState({
      [key] : value
    });
  }

  changeImageProfil = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      const response = await ImageManipulator.manipulateAsync(result.uri, [], { base64: true })
      let image64 = "data:image/jpeg;base64,"+ response.base64;
      this.setState({ imageProfil: image64 });
    }
  };





  render(){
    return(
    <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", width:screenWidth}}>
      {this.state.displayLoading ?
        <ActivityIndicator color={"green"} size={"large"}></ActivityIndicator>
        :
        <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center", width:screenWidth}}>
          <Image style={{position:"absolute", height:400, width:400, opacity:0.5}} source={require('../assets/images/logo2.png')}/>
          {this.state.popupConnexion || this.state.popupSignUp ?
            <TouchableOpacity onPress={this.quitLoginAndSignUp} style={{position:"absolute", top:0, left:0, zIndex:10, width:screenWidth, height:screenHeight,}}>
            </TouchableOpacity>
            :null
          }
          {this.state.popupConnexion ?
            <View style={{width:screenWidth*0.9, position:"absolute", top:100,  zIndex:11}}>
              <Login login={this.login} displayLoading={this.displayLoading} quit={this.quitLoginAndSignUp} changeState={this.changeState}
              password={this.state.password} email={this.state.email}/>
            </View>
            : null
          }
          {this.state.popupSignUp ?
            <View style={{width:screenWidth*0.9, position:"absolute",  top:50,  zIndex:11}}>
              <Signup signup={this.signup} displayLoading={this.displayLoading} quit={this.quitLoginAndSignUp} changeState={this.changeState} changeImageProfil={this.changeImageProfil}
            email={this.state.email} userName={this.state.userName} imageProfil={this.state.imageProfil} password={this.state.password} cpassword={this.state.cpassword} imageProfil={this.state.imageProfil}/>
            </View>
            : null
           }

          <View style={{marginTop:30, flexDirection:"row", alignItems:"center", flex:1}}>
            <TouchableOpacity  onPress={this.toggleLoginPopup} style={{width:150, height:50, backgroundColor:"rgba(10,200,36,0.7)", borderRadius:5, flexDirection:"row", justifyContent:"center", margin:10, alignItems:"center"}}>
              <Text style={{color:"white"}}>Login
              </Text>
            </TouchableOpacity >
            <TouchableOpacity  onPress={this.toggleRegisterPopup} style={{width:150, height:50, backgroundColor:"rgba(10,200,36,0.7)", borderRadius:5, flexDirection:"row", justifyContent:"center", margin:10, alignItems:"center"}}>
              <Text style={{color:"white"}}>Register
              </Text>
            </TouchableOpacity >
          </View>
        </View>
      }
    </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    connected:state.account.connectedRedux,
    accountState:state.account.accountStateRedux,
  }
}

const NoAccount = connect(mapStateToProps, mapDispatchToProps)(NoAccountComponent);
export default NoAccount;
