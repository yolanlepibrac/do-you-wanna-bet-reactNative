import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Button, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { ProgressCircle }  from 'react-native-svg-charts'

import BetItem from "./BetItem"
import ItemEditProfile from "./ItemEditProfile"
import API from "../Utils/API"

import { resetAccountState } from "../Redux/Actions/index";

function mapDispatchToProps(dispatch) {
  return {
    resetAccountState: () => dispatch(resetAccountState()),
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
      month : "Month",
      year : "Year",
      day : "Day",
      tabOfDay : ["Choose Month"],
      numberOfBetsFinished:0,
      account:this.props.accountState.account,
      toggleChangeAccountState:false,
      imageProfil: this.props.accountState.account.imageProfil,
      fill:10,
    };
  }

  _pickImage = async () => {
    if(this.state.toggleChangeAccountState){
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, ],
      });
      if (!result.cancelled) {
        const response = await ImageManipulator.manipulateAsync(result.uri, [], { base64: true })
        let image64 = "data:image/jpeg;base64,"+ response.base64;
        this.setState({ imageProfil:image64 });
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
        alert('Sorry, we need camera roll permissions to create your account ! Don\'t worry, we will never use it againt you');
      }
    }
  }

  changePassword = () => {
    alert("not available now")
    console.log(this.props.accountState)
  }


  setToDatabase = (account) => {
    this.toggleChangeAccountState();
    API.setUserInfo(account, this.props.accountState.account.id).then((data) => {
      localStorage.setItem("email", account.email)
      this.props.changeAccountState(account);
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


  render(){
    return(
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
                  <TouchableOpacity onPress={this.toggleChangeAccountState} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center" }}>
                    <Text style={{color:"white", fontWeight:"bold"}}>EDIT
                    </Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
            {this.state.toggleChangeAccountState?
              <View style={{width:75, height:25, width:"100%", justifyContent:"flex-end", flexDirection:"row", paddingRight:20 }}>
                <TouchableOpacity onPress={()=>this.setToDatabase(this.state.account)} style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(200,200,200,1)",justifyContent:"center", alignItems:"center"}}>
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
                  <ItemEditProfile placeHolder={"Name"} value={this.state.account.userName} heightSize={1} onChange={this.onInputChange} keyForState={"userName"} changePossible={this.state.toggleChangeAccountState}/>
                  <ItemEditProfile placeHolder={"Email"} value={this.state.account.email} heightSize={1} onChange={this.onInputChange} keyForState={"email"} changePossible={this.state.toggleChangeAccountState}/>
                  <ItemEditProfile placeHolder={"Phone"} value={ this.state.account.phone} heightSize={1} onChange={this.onInputChange} keyForState={"phone"} changePossible={this.state.toggleChangeAccountState}/>
                </View>
              </View>
              {
                /*
                <View style={{flexDirection:"column",}}>
                  <Text style={{fontSize:13}}>Birth</Text>
                  <View style={{flexDirection:"row", alignItems:"space-between", justifyContent:"space-between",paddingRight:10, width:"100%"}}>
                    <TouchableOpacity style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(235,235,235,1)",justifyContent:"center", alignItems:"center" }}><Text style={{color:"white", fontWeight:"bold"}}>DAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(235,235,235,1)",justifyContent:"center", alignItems:"center" }}><Text style={{color:"white", fontWeight:"bold"}}>MONTH</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:75, height:25, borderRadius:2, fontSize:15, backgroundColor:"rgba(235,235,235,1)",justifyContent:"center", alignItems:"center" }}><Text style={{color:"white", fontWeight:"bold"}}>YEAR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                */
              }

            </View>



            <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
              <ProgressCircle style={{height:160,width:160, position:"absolute", top:70, right:20}} progress={this.state.percentWon?this.state.percentWon:0} strokeWidth={30} progressColor={'rgb(134, 255, 155)'} backgroundColor={'rgb(255, 200,200)'} cornerRadius={2}/>
              <View style={{height:160,width:160, position:"absolute", top:70, right:20, textAlign:"center", alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:35}}>{this.state.percentWon*100 + "%"}
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
              <View style={{flexDirection:"column", alignItems:"flex-start", marginLeft:10, marginBottom:5, marginTop:5}}>
                <Text style={{width: 200, fontSize:13}}>{"Password"}
                </Text>
                <View style={{width: 10, flexDirection: 'column', marginBottom:5, marginTop:5, fontSize:15, justifyContent:"flex-start", marginLeft:0, marginRight:0,}}>
                  <Text style={{width: 200, height:30, flexDirection: 'column', justifyContent:"center", backgroundColor:"rgba(245,245,245,1)", borderRadius:3, paddingLeft:20, marginRight:20, color:"black", borderWidth:1, borderStyle:"solid", borderColor:"rgba(150,150,150,1)"}}>
                  {"•••••••••"}
                  </Text>
                  <TouchableOpacity style={{width: 200, height:30, fontSize:16, textAlign:"center", justifyContent:"flex-start", marginLeft:0, padding:0, borderWidth:0}} onPress={this.changePassword}>
                      <Text style={{color:"white"}}>Modifie</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            <View style={{flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
              <View style={{flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, paddingLeft:10, paddingRight:10,  borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid", width:"100%"}}>
                <Text style={{color:"grey"}}>OPTIONS</Text>
              </View>
              <Text>option1</Text>
              <Text>option2</Text>
              <Text>option3</Text>
              <Text>option4</Text>

            </View>



          </View>
      </ScrollView>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(AccountContainerComponent);
  export default AccountContainer;
