import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';




export default class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            userName: "",
            password: "",
            cpassword: "",
            imageProfil:"",
        }
    }


    signup = (event, context) => {
        this.props.signup(this.state.email, this.state.userName, this.state.imageProfil, this.state.password, this.state.cpassword)
    }

    onChangeUserName = (text) => {
        this.setState({
          userName : text
        });
    }
    onChangeEmail = (text) => {
        this.setState({
          email : text
        });
    }
    onChangePassword = (text) => {
        this.setState({
          password : text
        });
    }
    onChangeCPassword = (text) => {
        this.setState({
          cpassword : text
        });
    }

    _pickImage = async () => {
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


    render() {
        return(
          <View style={{backgroundColor:"rgba(235,235,235,1)", padding:10, flex:1}}>
            <View style={{marginBottom:10}}>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Full name
              </Text>
              <TextInput onChangeText={text => this.onChangeUserName(text)} value={this.state.userName} autoCompleteType={"userName"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, paddingLeft:10}}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Email
              </Text>
              <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.state.email} autoCompleteType={"email"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, paddingLeft:10}}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
              </Text>
              <TextInput onChangeText={text => this.onChangePassword(text)} value={this.state.password} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10}}>
              </TextInput >
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
              </Text>
              <TextInput onChangeText={text => this.onChangeCPassword(text)} value={this.state.cpassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10}}>
              </TextInput >
            </View>
            <TouchableOpacity onPress={this._pickImage}>
            {this.state.imageProfil ?
              <Image source={{uri:this.state.imageProfil}} style={{borderRadius:5, width:50, height:50}}/>
              :
              <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:5, width:50, height:50}}/>
            }
            </TouchableOpacity>
            <View style={{backgroundColor:"rgba(245,245,245,1)", justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity onPress={() => this.signup()}  style={{backgroundColor:"rgba(35,200,35,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>

        )
    }
}
