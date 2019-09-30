
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { connect } from "react-redux";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { ProgressCircle }  from 'react-native-svg-charts'

import { replaceFriend } from "../Redux/Actions/index";
import { setFriendsState } from "../Redux/Actions/index";
import Utils from "../Utils/Utils"
import API from '../Utils/API';

import { withNavigationFocus } from 'react-navigation';


function mapDispatchToProps(dispatch) {
  return {
    replaceFriend: (friend) => dispatch(replaceFriend(friend)),
    setFriendsState: (tabOfFriends) => dispatch(setFriendsState(tabOfFriends)),
  };
};

class FriendDetailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myMark : 0,
      made : 0,
      refused : 0,
     }
  }

  displayToggleFriend = () => {
    if(this.props.alreadyFriend){
      return <Image source={require('../assets/images/moinsWhite.png')} style={{borderRadius:15, width:30, height:30, backgroundColor:"rgba(255,10,10,0.4)", borderWidth:1}}/>
    }else{
      return <Image source={require('../assets/images/addFriend.png')} style={{borderRadius:15, width:30, height:30}}/>
    }
  }


  componentDidMount() {

    this.setState({
      friends : this.props.navigation.getParam('friends', undefined),
      alreadyFriend : this.props.navigation.getParam('alreadyFriend', false),
    });

    let friend = this.props.navigation.getParam('friend', undefined)
    this.setState({
      friend : friend,
    })
    console.log(friend.bets)
    for (var i = 0; i < friend.bets.length; i++) {
      if(friend.bets[i].accepted){
        this.setState({made : this.state.made + 1})
      }else{
        this.setState({refused : this.state.refused + 1})
      }
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        friend : this.props.navigation.getParam('friend', undefined),
        alreadyFriend : this.props.navigation.getParam('alreadyFriend', false),
      });
    }
  }

  toggleFriend = () => {
    const toggleFriend = this.props.navigation.getParam('toggleFriend');
    toggleFriend(this.state.friend);
    this.setState({alreadyFriend:!this.state.alreadyFriend})
  }



  isWitnessOfMyBet = (friend) =>  {
    let friendWasWitnessOfMyBet = false
    for (var i = 0; i < this.props.accountState.bets.length; i++) {
      if(this.props.accountState.bets[i].current === false){
        if(this.props.accountState.bets[i].witness === friend.id){
          friendWasWitnessOfMyBet = true
        }
      }
    }
    return friendWasWitnessOfMyBet
  }


  toggleRankFriend = () => {
    console.log(this.state.friend.judgeNotes)
    console.log(this.calculjudgeNote(this.state.friend.judgeNotes))
    if(this.isWitnessOfMyBet(this.state.friend)){
      this.setState({rankOpen:!this.state.rankOpen})
    }else{
      this._showAlert("This guy never judged one of you bet")
    }
  }

  validate = () => {
    this.setState({rankOpen:false, displayLoading:true})
    API.noteFriend(this.props.accountState.account.id, this.state.friend.id, this.state.myMark).then((res)=>{
      if(res.data.errorOccured){
        this._showAlert("Impossible to note your friend, please try again")
      }
      console.log(res.data.friendNoted)
      console.log(res.data.friendNoteGiver)
      if(res.data.friendNoted.id !== undefined){
        this.props.replaceFriend(res.data.friendNoted)
      }
      if(res.data.friendNoteGiver.id !== undefined){
        this.props.replaceFriend(res.data.friendNoteGiver)
      }

      if(res.data.friendNoted.id !== undefined){
        let newAccountState = this.props.accountState
        for (var i = 0; i < newAccountState.friends.length; i++) {
          if(newAccountState.friends[i].id === res.data.friendNoted.id){
            newAccountState.friends[i] === res.data.friendNoted
          }
        }
        this.setState({friend : res.data.friendNoted, friends : newAccountState.friends})
      }
      this.setState({displayLoading:false,})
    }).catch((error)=>{
      console.log(error)
      this.setState({displayLoading:false,})
    })
  }

  _showAlert = (errorMessage) => {
    Alert.alert(
      'Impossible to note',
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }


  setRank = (value) => {
    this.setState({
      myMark:value
    })
  }

  calculjudgeNote = (tabofJudgeNote) => {
    let sum = 0
    for (var i = 0; i < tabofJudgeNote.length; i++) {
      sum = sum + tabofJudgeNote[i].note
    }
    return sum/tabofJudgeNote.length
  }



  render(){
    const { params} = this.props.navigation.state;
    if(this.state.friend !== undefined && !this.state.displayLoading){
      return(
      <ScrollView>
        <View style={{flex:1, flexDirection:"column",marginTop:10, alignItems:"center", justifyContent:"center", paddingLeft:20, paddingRight:20}}>

          <View style={{height:170, flexDirection:"row"}}>
            {!this.state.alreadyFriend ?
              <TouchableOpacity onPress={this.toggleFriend}  style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                <Text style={{color:"white", fontWeight:"bold"}}>ADD FRIEND</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.toggleFriend} style={{backgroundColor:"rgba(219,110,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                <Text style={{color:"white", fontWeight:"bold"}}>DELETE FRIEND</Text>
              </TouchableOpacity>
            }
          </View>

          <View style={{height:170, flexDirection:"row"}}>
            {this.state.friend.imageProfil ?
              <Image source={{uri:this.state.friend.imageProfil}} style={{borderRadius:75, width:150, height:150}}/>
              :
              <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:75, width:150, height:150}}/>
            }
            <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <Text style={{fontSize:30}}>{this.state.friend.userName}</Text>
              <Text style={{fontSize:15, color:"rgba(100,100,100,1)"}}>{this.state.friend.email}</Text>
            </View>
          </View>
          <View style={{width:"100%", height:1, backgroundColor:"rgba(100,100,100,1)", flexDirection:"row"}}>
          </View>

          <View style={{flex:1, flexDirection:"row", marginTop:30, justifyContent:"space-between", width:"100%"}}>
              <View style={{flexDirection: 'column', alignItems:"flex-start"}}>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets made  : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.made}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets won   : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.friend.won !== undefined ? this.state.friend.won : 0}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets lost  : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.friend.lost !== undefined ? this.state.friend.lost : 0}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"witness of : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.friend.witnessOf !== undefined ? this.state.friend.witnessOf.length : 0}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"friends    : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.friend.friends !== undefined? this.state.friend.friends.length : 0}</Text>
                </View>
              </View>

              <View style={{ width:160, height:160, alignItems:"center", justifyContent:"center"}}>
                <ProgressCircle style={{height:160,width:160, position:"absolute", top:0, right:0}} progress={this.state.friend.won?this.state.friend.won/(this.state.friend.won+this.state.friend.lost):0} strokeWidth={30} progressColor={'rgb(134, 255, 155)'} backgroundColor={'rgb(255, 200,200)'} cornerRadius={2}/>
                <View style={{height:160,width:160, position:"absolute", top:0, right:0, alignItems:"center", justifyContent:"center"}}>
                  <Text style={{fontSize:35}}>{this.state.friend.won?Math.round(this.state.friend.won/(this.state.friend.won+this.state.friend.lost)*100) + "%":"0%"}
                  </Text>
                </View>
              </View>

          </View>

          <View style={{width:"100%", height:1, backgroundColor:"rgba(100,100,100,1)", flexDirection:"row"}}>
          </View>
          <View style={{flex:1, flexDirection:"column", marginTop:30, alignItems:"center",}}>
            <View style={{height:50, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
              {this.state.friend.witnessOf !== undefined ?
                <View><Text style={{color:"rgba(130,130,130,1)", fontSize:25}}>{this.state.friend.witnessOf.length + " bets judged"}</Text></View>
                :null
              }
            </View>
            {this.state.friend.judgeNotes.length>0 ?
              <TouchableOpacity onPress={this.toggleRankFriend}>
                {Utils.displayMark(this.calculjudgeNote(this.state.friend.judgeNotes), 300)}
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.toggleRankFriend} style={{backgroundColor:"rgba(110,219,124,1)", borderWidth:0, borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                <Text style={{color:"white", fontWeight:"bold"}}>Rank my friend</Text>
              </TouchableOpacity>
            }
          </View>
          {this.state.rankOpen ?
            <TouchableOpacity onPress={this.toggleRankFriend} style={{position:"absolute", top:0, width:0, flex:1, width:"100%", height:"100%", backgroundColor:"rgba(255,255,255,0.95)", zIndex:101, alignItems:"center", justifyContent:"center"}}>
              <View style={{flex:1, width:"100%", justifyContent:"flex-end", flexDirection:"column", alignItems:"center"}}>
                <View style={{height:100, width:250, zIndex:102}}>
                  <View style={{position:"absolute", top:0, left:0, width:250, height:70,justifyContent:"center", alignItems:"center", flexDirection:"column", zIndex:103}}>
                    {Utils.displayMark(this.state.myMark, 250)}
                  </View>
                  <View style={{position:"absolute", top:0, left:0, width:250, height:70, alignItems:"center", flexDirection:"row", zIndex:104}}>
                    <TouchableOpacity onPress={()=>this.setRank(1)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0)"}}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setRank(2)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0)"}}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setRank(3)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0)"}}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setRank(4)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0)"}}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setRank(5)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0)"}}>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{flex:1}}>
                <TouchableOpacity onPress={this.validate}  style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                  <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            :
            null
          }

        </View>
      </ScrollView>
      )
    }else{
      return(
        <View style={{flex:1, flexDirection:"column", height:70, paddingLeft:20, paddingRight:20, marginTop:10, alignItems:"center", justifyContent:"center"}}>
          <ActivityIndicator size={"large"} color={"green"}/>
        </View>
      )
    }

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux
  }
}

const FriendDetail = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(FriendDetailComponent));
export default FriendDetail;
