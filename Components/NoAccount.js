

import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, AsyncStorage, Alert } from 'react-native';
import { connect } from "react-redux";

import API from '../Utils/API';
import Signup from './Signup';
import Login from './Login';


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
      email : "",
      password :"",
      displayLoading :false,
    };
  }


  toggleLoginPopup = () => {
    this.setState({
      popupConnexion:!this.state.popupConnexion,
      popupSignUp : false,
      email: "",
      password : "",
    })
  }

  toggleRegisterPopup = () => {
    this.setState({
      popupSignUp:!this.state.popupSignUp,
      popupConnexion : false,
      email: "",
      password : "",
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
    AsyncStorage.getItem('email').then((emailStored) => {
      if(emailStored){
        this.login(emailStored)
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



  login = (email) => {
    //this.setState({displayLoading:true})
    API.getUserDataByEmail(email).then((dataCurrentUser)=>{
      if(dataCurrentUser.status != 200 ){
        this._showAlert("sorry we did not find you account, check your connexion")
        this.setState({displayLoading:false})
      }
      console.log("userdata ok")
      this.props.changeAccountState(dataCurrentUser.data.userData);
      this.stayLog(dataCurrentUser.data.userData.email)
      API.getUsersDataByID(dataCurrentUser.data.userData.friends).then((dataFriends)=>{
        console.log(dataFriends.data.usersData)
        this.props.getUserFriends(dataFriends.data.usersData);
        API.getBetsDataByID(dataCurrentUser.data.userData.bets).then((dataBets)=>{
          console.log(dataBets.data.bets)
          this.props.getUserBets(dataBets.data.bets);
          API.getUsersDataByID(dataCurrentUser.data.userData.witnessOf).then((dataWitnessOf)=>{
            console.log(dataWitnessOf.data.usersData)
            this.props.getUserWitnessOf(dataWitnessOf.data.usersData);
            this.setState({
              displayLoading:false,
              email:email,
            })
            //this.props.navigation.navigate("TopNavigation", {email:email})
            //console.log("everythung ok")
          });
        });
      });
    }).catch(error => {
      this._showAlert("the server can not be reached. Please, check your connexion !")
      this.setState({displayLoading:false})
    });
    this.props.navigation.navigate("TopNavigation", {email:email})
  }


  signup = (email, userName, imageProfil, password, cpassword) => {
    this.setState({displayLoading:true})
    if(userName.length === 0 || email.length === 0 || imageProfil.length === 0 || password.length === 0 || (password !== cpassword)){
      this.setState({displayLoading:false})
    }
    if(userName.length === 0){
      this._showAlert("Please choose a user name")
      return;
    }
    if(email.length === 0){
      this._showAlert("Please fill your email")
      return;
    }
    if(imageProfil.length === 0){
      this._showAlert("Please pick a profile picture")
      return;
    }
    if(password.length === 0 || password !== cpassword){
      this._showAlert("Carefull, password and confirm password does not match or are invalid")
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
        this.props.navigation.navigate("TopNavigation", {email:data.data.userData.email})
        this.stayLog(data.data.userData.email)
        this.setState({displayLoading:false});
      }else if(data.status === 204){
        this._showAlert("This email is already used")
        this.setState({displayLoading:false})
      }
    },function(error){
        this._showAlert("error with server")
        this.setState({displayLoading:false});
    })
  }


  _showAlert = (errorMessage) => {
    Alert.alert(
      'Error',
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }





  render(){
    return(
    <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", width:screenWidth}}>
      {this.state.displayLoading ?
        <ActivityIndicator color={"green"} size={"large"}></ActivityIndicator>
        :
        <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center", width:screenWidth}}>
          {this.state.popupConnexion || this.state.popupSignUp ?
            <TouchableOpacity onPress={this.quitLoginAndSignUp} style={{position:"absolute", top:0, left:0, zIndex:10, width:screenWidth, height:screenHeight,}}>
            </TouchableOpacity>
            :null
          }
          {this.state.popupConnexion ?
            <View style={{width:screenWidth*0.9, position:"absolute", top:100,  zIndex:11}}>
              <Login login={this.login} displayLoading={this.displayLoading} setError={this._showAlert}/>
            </View>
            : null
          }
          {this.state.popupSignUp ?
            <View style={{width:screenWidth*0.9, position:"absolute",  top:100,  zIndex:11}}>
              <Signup signup={this.signup} displayLoading={this.displayLoading} setError={this._showAlert}/>
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
