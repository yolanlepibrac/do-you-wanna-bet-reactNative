import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, Dimensions, TextInput } from 'react-native';

import API from '../Utils/API';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: "",
            displayLoading:false,
        }
    }

  send = () => {
      if(this.state.email.length === 0){
          return;
      }
      if(this.state.password.length === 0){
          return;
      }
      this.props.displayLoading(true)
      API.login(this.state.email, this.state.password).then((dataUser)=>{
        if(dataUser.status===200){
          this.props.login(this.state.email, "bet on")
        }else{
          this.props.setError("Impossible to connect, password and email does not match")
          this.props.displayLoading(false)
        }
      }).catch(error => {
        this.props.setError("Error, please check your connexion")
        this.props.displayLoading(false)
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




    render() {
        return(
            <View style={{backgroundColor:"rgba(235,235,235,1)", padding:10, flex:1}}>
              <View style={{marginBottom:10}}>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Email
                </Text>
                <TextInput onChangeText={text => this.onChangeEmail(text)} value={this.state.email} autoCompleteType={"email"} autoFocus={true} clearButtonMode={'while-editing'} style={{borderWidth:1, height:35, paddingLeft:10}}>
                </TextInput>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Password
                </Text>
                <TextInput onChangeText={text => this.onChangePassword(text)} value={this.state.password} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10}}>
                </TextInput >
              </View>
              <View style={{backgroundColor:"rgba(245,245,245,1)", justifyContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={() => this.send()}  style={{backgroundColor:"rgba(35,200,35,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                  <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>CONNEXION</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
    }
}
