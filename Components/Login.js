import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput, Image } from 'react-native';

import API from '../Utils/API';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: "",
            displayLoading:false,
            securePassword : true,
        }
    }

  send = () => {
      if(this.state.email.length === 0){
          return;
      }
      if(this.state.password.length === 0){
          return;
      }
      this.props.login(this.state.email, this.state.password)

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


  toggleSecurePassword = () => {
    console.log(this.state.securePassword)
    this.setState({securePassword:!this.state.securePassword})
  }

  quitlogin = () => {
    this.props.quit()
  }


    render() {
        return(
            <View style={{backgroundColor:"rgba(235,235,235,1)", padding:10, flex:1}}>
              <View style={{marginBottom:10}}>
                <View style={{ height:30, paddingLeft:10, flex:1, width:"100%"}}>
                  <TouchableOpacity onPress={this.quitlogin} style={{position:"absolute", width:30, height:30, top:0, right:0, }}>
                    <Image style={{ width:30, height:30,}} source={require('../assets/images/quit.png')}/>
                  </TouchableOpacity>
                </View>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Email
                </Text>
                <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.state.email} autoCompleteType={"email"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, paddingLeft:10}}>
                </TextInput>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
                </Text>
                <View>
                  <TextInput onChangeText={text => this.onChangePassword(text)} value={this.state.password} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.securePassword}>
                  </TextInput >
                  <TouchableOpacity onPress={this.toggleSecurePassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                    <Image style={{ width:35, height:35,}} source={require('../assets/images/oeil.png')}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ justifyContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={() => this.send()}  style={{backgroundColor:"rgba(35,200,35,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                  <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>CONNEXION</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
    }
}
