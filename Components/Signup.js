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
            securePassword : true,
            secureCPassword : true,
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

    toggleSecurePassword = () => {
      console.log(this.state.securePassword)
      this.setState({securePassword:!this.state.securePassword})
    }

    toggleSecureCPassword = () => {
      this.setState({secureCPassword:!this.state.secureCPassword})
    }

    quitlogin = () => {
      this.props.quit()
    }


    render() {
        return(
          <View style={{backgroundColor:"rgba(235,235,235,1)", padding:10, flex:1 }}>
            <View style={{marginBottom:10, flex:1}}>
              <View style={{ height:30, paddingLeft:10, flex:1, width:"100%"}}>
                <TouchableOpacity onPress={this.quitlogin} style={{position:"absolute", width:30, height:30, top:0, right:0, }}>
                  <Image style={{ width:30, height:30,}} source={require('../assets/images/quit.png')}/>
                </TouchableOpacity>
              </View>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Full name
              </Text>
              <TextInput onChangeText={text => this.onChangeUserName(text)} value={this.state.userName} autoCompleteType={"username"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10}}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Email
              </Text>
              <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.state.email} autoCompleteType={"email"} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10}}>
              </TextInput>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
              </Text>
              <View style={{flexDirection:"row", width:"100%", flex:1}}>
                <TextInput onChangeText={text => this.onChangePassword(text)} value={this.state.password} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.securePassword}>
                </TextInput >
                <TouchableOpacity onPress={this.toggleSecurePassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                  <Image style={{ width:35, height:35}} source={this.state.securePassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                </TouchableOpacity>
              </View>
              <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
              </Text>
              <View >
                <TextInput onChangeText={text => this.onChangeCPassword(text)} value={this.state.cpassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, padding:0, margin:0, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.secureCPassword}>
                </TextInput >
                <TouchableOpacity onPress={this.toggleSecureCPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                  <Image style={{ width:35, height:35,}} source={this.state.secureCPassword?require('../assets/images/oeil.png'):require('../assets/images/oeilSelect.png')}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection:"row", width:"100%", flex:1, justifyContent:"center"}}>
              <TouchableOpacity onPress={this._pickImage} style={{height:70}}>
              {this.state.imageProfil ?
                <Image source={{uri:this.state.imageProfil}} style={{borderRadius:5, width:70, height:70}}/>
                :
                <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:5, width:70, height:70}}/>
              }
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity onPress={() => this.signup()}  style={{backgroundColor:"rgba(35,200,35,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>

        )
    }
}
