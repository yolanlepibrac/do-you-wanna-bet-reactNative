import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Button, AsyncStorage , TextInput, Platform, DatePickerIOS, DatePickerAndroid, Alert} from 'react-native';
import { connect } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { ProgressCircle }  from 'react-native-svg-charts'

import DateTimePicker from '@react-native-community/datetimepicker';



import BetItem from "./BetItem"
import ItemEditProfile from "./ItemEditProfile"
import API from "../Utils/API"

import { resetAccountState } from "../Redux/Actions/index";
import { changeAccountState } from "../Redux/Actions/index";

function mapDispatchToProps(dispatch) {
  return {
    resetAccountState: () => dispatch(resetAccountState()),
    changeAccountState: (account) => dispatch(changeAccountState(account))
  };
};

const Months = [  'janvier',  'fevrier',  'mars',  'avril',  'mai',  'juin',  'juillet',  'aout',  'septembre',  'octobre',  'novembre',  'decembre']
const Days = [  31,  28,  31,  30,  31,  30,  31,  31,  30,  31,  30,  31]
const heightItem = 100;
const borderWidth = 4;
const coloWin = "rgba(87,201,108)"
const coloLoose = "rgba(255,82,82)"
var listeOfDate = []
var currentYear = new Date().getFullYear()
for(var i=currentYear;i>1930;i--){
  listeOfDate.push(i)
}


class AccountContainerComponent extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
      displayLoading:false,
      month : "Month",
      year : "Year",
      day : "Day",
      tabOfDay : ["Choose Month"],
      numberOfBetsFinished:0,
      account:this.props.accountState.account,
      toggleChangeAccountState:false,
      imageProfil: this.props.accountState.account.imageProfil,
      //birth : this.props.accountState.account.birth ? this.props.accountState.account.birth :undefined,
      fill:10,
      oldPassword : "",
      oldCPassword : "",
      newPassword : "",
      changePasswordOpen : false,
      secureOldPassword : true,
      secureOldCPassword : true,
      secureNewPassword : true,
      date: this.props.accountState.account.birth ? this.props.accountState.account.birth :new Date(),
    };
  }

  setDate = (event, date) => {
    let account = this.state.account;
    account.birth = this.dateToString(date)
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date : date,
      account : account,
    });
  }

  dateToString = (date) => {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;
    return date
  }

  resetDate = () => {
    let account = this.state.account;
    account.birth = this.props.accountState.account.birth ? this.props.accountState.account.birth :undefined
    this.setState({
      account: account,
      date:new Date(),
    })
  }

  setDateAndroid = async () => {
    let currentDate
    if(this.props.accountState.account.birth){
      currentDate = this.props.accountState.account.birth;
      currentDate = currentDate.substring(currentDate.length-4, currentDate.length) +"-"+ currentDate.substring(currentDate.length-7, currentDate.length-5) +"-"+ currentDate.substring(currentDate.length-10, currentDate.length-8)
      currentDate = new Date(currentDate)
    }else{
      currentDate = new Date()
    }

    console.log(currentDate)
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        maxDate : new Date(),
        date: currentDate,
        mode: "default",
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        let realMonth = month+1
        console.log(realMonth)
        let newDay = day<10?"0"+day:day;
        let newMonth = realMonth<10?"0"+realMonth:realMonth;
        let date = newDay + "/" + newMonth + "/" + year
        let account = this.state.account;
        account.birth = date
        this.setState({account:account})
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  _pickImage = async () => {
    if(this.state.toggleChangeAccountState){
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
      });
      if (!result.cancelled) {
        const response = await ImageManipulator.manipulateAsync(result.uri, [], { base64: true })
        let image64 = "data:image/jpeg;base64,"+ response.base64;
        this.setState({ imageProfil:image64 });
        let newAccount = this.state.account
        newAccount.imageProfil = image64
        this.setState({ account : newAccount });
      }
    }
  };

  componentDidMount() {
    this.getPermissionAsync();
    var numberOfBetsFinished = 0
    var won = this.props.accountState.account.won ? this.props.accountState.account.won : 0
    for (var i = 0; i < this.props.accountState.bets.length; i++) {
      if(!this.props.accountState.bets[i].current){
        numberOfBetsFinished++
      }
    }
    if(numberOfBetsFinished>0){
      var percentWon =  won / numberOfBetsFinished
    }else{
      percentWon = 0
    }
    this.setState({
      percentWon : percentWon,
      numberOfBetsFinished:numberOfBetsFinished,
      won : won,
    })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to change your account ! Don\'t worry, we will never use it againt you');
      }
    }
  }

  changePassword = () => {
    alert("not available now")
    console.log(this.props.accountState)
  }


  setToDatabase = (account) => {
    this.toggleChangeAccountState();
    console.log(account)
    API.setUserInfo(account, this.props.accountState.account.id).then((data) => {
      this.props.changeAccountState(account);
      this.setState({account:account})
      this.setState({toggleChangeAccountState:false})
    })
  }

  onInputChange = (key, value) => {
    var newAccount = this.state.account
    newAccount[key] = value
    this.setState({account : newAccount})
  }

  toggleChangeAccountState = () => {
    this.setState({
      toggleChangeAccountState : !this.state.toggleChangeAccountState
    })
  }

  logout = () => {
    this.props.resetAccountState()
    this.props.navigation.navigate("NoAccount", {email:""})
    this.quitLog()
  }

  quitLog = async () => {
    try {
      await AsyncStorage.removeItem('email');
    } catch (error) {
      console.log(error.message);
    }
  }

  changePassword = () => {
    this.setState({changePasswordOpen : !this.state.changePasswordOpen})
  }

  ValidateChangePassword = () => {
    this.setState({displayLoading:true})
    if(this.state.oldPassword === "" || this.state.oldPassword === undefined || this.state.oldPassword !== this.state.oldCPassword || this.state.newPassword === ""){
      this._showAlert("Error", "Password and Confirm password are different or invalid")
      this.setState({displayLoading:false})
      return
    }else{
      API.updatePassword(this.props.accountState.account.id, this.state.oldPassword, this.state.newPassword).then((data) => {
        console.log(data)
        if(data.status !== 200){
          this._showAlert("Error","Impossibe to change your password")
        }else{
          this._showAlert("OK", "Password have been change")
          this.setState({changePasswordOpen : false})
        }
        this.setState({displayLoading:false})
      }).catch(error=>{
        console.log(error)
        this._showAlert("Error", "Error : Impossibe to change your password")
        this.setState({displayLoading:false})
      })
    }
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

  onChangeOldPassword = (text) => {
      this.setState({
        oldPassword : text
      });
  }
  onChangeOldCPassword = (text) => {
      this.setState({
        oldCPassword : text
      });
  }
  onChangeNewPassword = (text) => {
      this.setState({
        newPassword : text
      });
  }

  toggleSecureOldPassword = () => {
    console.log(this.state.securePassword)
    this.setState({secureOldPassword:!this.state.secureOldPassword})
  }

  toggleSecureOldCPassword = () => {
    this.setState({secureOldCPassword:!this.state.secureOldCPassword})
  }

  toggleSecureNewPassword = () => {
    this.setState({secureNewPassword:!this.state.secureNewPassword})
  }


  render(){
    if(this.state.displayLoading){
      return <ActivityIndicator color={"green"} size={"large"}></ActivityIndicator>
    }else{

        return(
          <View style={{flex:1}}>

          {this.state.changePasswordOpen ?
            <View style={{flexDirection:"column",height:"100%", width:"100%", position:"absolute", top:0, left:0, flex:1, backgroundColor:"white",padding:10}}>
              <View style={{flexDirection:"column",  width:"100%"}}>
                <View style={{flexDirection:"row", width:"100%", justifyContent:"flex-end"}}>
                  <TouchableOpacity onPress={this.changePassword} style={{width:75, height:35, borderRadius:2, fontSize:15, marginTop:10, marginBottom:10, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center" }}>
                    <Text style={{color:"white", fontWeight:"bold"}}>CANCEL</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Old Password
                </Text>
                <View style={{flexDirection:"row", width:"100%",  height:50}}>
                  <TextInput onChangeText={text => this.onChangeOldPassword(text)} value={this.state.oldPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.secureOldPassword}>
                  </TextInput >
                  <TouchableOpacity onPress={this.toggleSecureOldPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                    <Image style={{ width:35, height:35}} source={require('../assets/images/oeil.png')}/>
                  </TouchableOpacity>
                </View>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>Confirm Old Password
                </Text>
                <View style={{flexDirection:"row", width:"100%",  height:50}}>
                  <TextInput onChangeText={text => this.onChangeOldCPassword(text)} value={this.state.oldCPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.secureOldCPassword}>
                  </TextInput >
                  <TouchableOpacity onPress={this.toggleSecureOldCPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                    <Image style={{ width:35, height:35,}} source={require('../assets/images/oeil.png')}/>
                  </TouchableOpacity>
                </View>
                <Text style={{height:30, fontSize:15, fontWeight:"bold", marginLeft:10}}>New Password
                </Text>
                <View style={{flexDirection:"row", width:"100%",  height:50}}>
                  <TextInput onChangeText={text => this.onChangeNewPassword(text)} value={this.state.newPassword} autoCompleteType={"password"}  style={{borderWidth:1, height:35, paddingLeft:10, flex:1, width:"100%"}} secureTextEntry={this.state.secureNewPassword}>
                  </TextInput >
                  <TouchableOpacity onPress={this.toggleSecureNewPassword} style={{position:"absolute", width:30, height:35, top:0, right:20, }}>
                    <Image style={{ width:35, height:35,}} source={require('../assets/images/oeil.png')}/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.ValidateChangePassword} style={{backgroundColor:"rgba(35,200,35,1)", marginTop:5, marginBottom:5, borderRadius:2}}>
                  <Text style={{color:"white", height:30, fontSize:15, fontWeight:"bold", borderRadius:2, marginTop:5, marginBottom:5, marginLeft:10, marginRight:10}}>VALIDATE</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            <ScrollView style={{flex:1, flexDirection:"column"}}>

                <TouchableOpacity onPress={this.logout} style={{position:"absolute", top:15, left:10, width:50, height:50, borderRadius:50/2, backgroundColor:"rgba(240,240,240,1)"}}>
                  <Image  source={require('../assets/images/exit.png')} style={{width:50, height:50, borderRadius:50/2}}/>
                </TouchableOpacity>

                <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                  <Text style={{fontWeight:"bold", fontSize:20, color:"rgba(178,178,178,1)", marginTop:30}}>SETTINGS</Text>
                </View>


                <View style={{flex:1, paddingBottom:10,  flexDirection: 'column',  marginBottom:10, alignItems:"flex-start"}}>

                  <View style={{flex:1,flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid", width:"100%"}}>
                    <View style={{flex:1, flexDirection: 'row', justifyContent:"space-between", alignItems:"center", width:"100%", paddingRight:20, paddingLeft:10}}>
                      <Text style={{color:"grey"}}>PROFILE</Text>
                      {this.state.toggleChangeAccountState?

                        <TouchableOpacity onPress={this.toggleChangeAccountState} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center" }}>
                          <Text style={{color:"white", fontWeight:"bold"}}>CANCEL</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.toggleChangeAccountState} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center"}}>
                          <Text style={{color:"white", fontWeight:"bold"}}>EDIT
                          </Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                  {this.state.toggleChangeAccountState?
                    <View style={{width:75, height:25, width:"100%", justifyContent:"flex-end", flexDirection:"row", paddingRight:20 }}>
                      <TouchableOpacity onPress={()=>this.setToDatabase(this.state.account)} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center" }}>
                        <Text style={{color:"white", fontWeight:"bold"}}>SUBMIT
                        </Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={{width:75, height:25, width:"100%" }}>
                    </View>
                  }


                  <View style={{flex:1,flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10,  width:"100%", paddingRight:20, paddingLeft:10}}>
                    <View style={{flex:1, flexDirection: 'row', alignItems:"flex-start",paddingTop:20}}>
                      <View style={{flex:1, flexDirection: 'column', alignItems:"flex-start"}}>
                          <Text style={{ fontSize:13, marginBottom:10}}>Profile Picture</Text>
                          <TouchableOpacity onPress={this._pickImage} style={{borderWidth:0,borderRadius:20, borderWidth:this.state.toggleChangeAccountState?1:0, borderColor:"rgba(100,100,100,1)", overflow: "hidden"}}>
                            {this.state.imageProfil ?
                              <Image source={{uri : this.state.imageProfil}} style={{height:160, width:160}}/>
                              :
                              <Image source={require('../assets/images/connectBig.png')} style={{height:160, width:160}}/>
                            }
                          </TouchableOpacity>
                      </View>
                      <View style={{flex:1,  flexDirection: 'column', alignItems:"flex-start"}}>
                        <ItemEditProfile placeHolder={"Name"} value={this.state.account.userName} heightSize={1} onChange={this.onInputChange} keyForState={"userName"} changePossible={this.state.toggleChangeAccountState} autoCompleteType="name"/>
                        <ItemEditProfile placeHolder={"Email"} value={this.state.account.email} heightSize={1} onChange={this.onInputChange} keyForState={"email"} changePossible={this.state.toggleChangeAccountState} autoCompleteType="email"/>
                        <ItemEditProfile placeHolder={"Phone"} value={ this.state.account.phone} heightSize={1} onChange={this.onInputChange} keyForState={"phone"} changePossible={this.state.toggleChangeAccountState} autoCompleteType="tel"/>
                      </View>

                    </View>
                    <Text style={{width: "100%", textAlign:"left", fontSize:13}}>Birth Day</Text>
                    <View style={{flexDirection:'row', justifyContent:"center", borderRadius:3, borderWidth:this.state.toggleChangeAccountState?1:0, borderStyle:"solid", borderColor:"rgba(100,100,100,1)", backgroundColor:"rgba(245,245,245,1)", paddingLeft:10, height:30, width:160, alignItems:"center"}}>
                      {Platform.OS === 'ios' ?
                        <DatePickerIOS  date={this.state.date} onDateChange={this.setDate}/>
                        :
                        <TouchableOpacity onPress={this.state.toggleChangeAccountState?this.setDateAndroid:null} title="Pick date" style={{flex:1,  height:35, justifyContent:"center"}}>
                          {this.state.account.birth?
                            <View><Text style={{color:this.state.toggleChangeAccountState?"rgba(50,50,50,1)":"rgba(150,150,150,1)",}}>{this.state.account.birth}</Text></View>
                            :
                            <View><Text style={{color:this.state.toggleChangeAccountState?"rgba(50,50,50,1)":"rgba(150,150,150,1)",}}>not defined yet</Text></View>
                          }
                        </TouchableOpacity>
                      }
                    </View>
                  </View>



                  <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                    <ProgressCircle style={{height:160,width:160, position:"absolute", top:70, right:20}} progress={this.state.percentWon?this.state.percentWon:0} strokeWidth={30} progressColor={'rgb(134, 255, 155)'} backgroundColor={'rgb(255, 200,200)'} cornerRadius={2}/>
                    <View style={{height:160,width:160, position:"absolute", top:70, right:20, textAlign:"center", alignItems:"center", justifyContent:"center"}}>
                      <Text style={{fontSize:35}}>{Math.round(this.state.percentWon*100) + "%"}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, paddingLeft:10, paddingRight:10,  borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid", width:"100%"}}>
                      <Text style={{color:"grey"}}>GENERAL</Text>
                    </View>
                    <View style={{flexDirection: 'column', paddingLeft:10, marginTop:20}}>
                      <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                        <Text style={{width:100, fontSize:15}}>{"bets made  : "}</Text>
                        <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.bets.length}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                        <Text style={{width:100, fontSize:15}}>{"bets won   : "}</Text>
                        <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.won}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                        <Text style={{width:100, fontSize:15}}>{"bets lost  : "}</Text>
                        <Text style={{width:50, fontSize:20, color:"grey"}}>{(this.state.numberOfBetsFinished-this.state.won)}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                        <Text style={{width:100, fontSize:15}}>{"witness of : "}</Text>
                        <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.witnessOf.length}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                        <Text style={{width:100, fontSize:15}}>{"friends    : "}</Text>
                        <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.friends.length}</Text>
                      </View>
                    </View>

                  </View>


                  <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                    <View style={{flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, paddingLeft:10, paddingRight:10,  borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid", width:"100%"}}>
                      <Text style={{color:"grey"}}>SECURITY</Text>
                    </View>
                    <View style={{flexDirection:"column", alignItems:"flex-start", marginLeft:10, marginBottom:5, marginTop:5, flex:1}}>
                      <Text style={{width: 200, fontSize:13}}>{"Password"}
                      </Text>
                      <View style={{flexDirection: 'column', marginBottom:5, marginTop:5, fontSize:15, justifyContent:"flex-start", marginLeft:0, marginRight:0,}}>
                        <TouchableOpacity onPress={this.changePassword} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center"}}>
                          <Text style={{color:"white", fontWeight:"bold"}}>MODIFIE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>


                  <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                    <View style={{flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, paddingLeft:10, paddingRight:10,  borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid", width:"100%"}}>
                      <Text style={{color:"grey"}}>OPTIONS</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%", paddingLeft:10, paddingRight:10}}>
                      <Text>No option for now</Text>
                    </View>
                  </View>

                </View>



            </ScrollView>

          }




          </View>
        )
      }

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(AccountContainerComponent);
  export default AccountContainer;
