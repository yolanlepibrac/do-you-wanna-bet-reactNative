import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { connect } from "react-redux";
import API from '../Utils/API';


function mapDispatchToProps(dispatch) {
  return {
  };
};


class BetItemComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      players1 : [],
      players2 : [],
      witness : [],
      imTheWitness : false,
      iWon : false,
     }
  }

  getFriendsWithTabId = (tabOfFriendID, key) => {
      var newTabOfFriendID = [];
      var copiedTabOfFriendID = [];
      Object.assign(copiedTabOfFriendID, tabOfFriendID);
      console.log(copiedTabOfFriendID)
      for (var i = 0; i < copiedTabOfFriendID.length; i++) {
        if(copiedTabOfFriendID[i] === this.props.accountState.account.id){
          newTabOfFriendID.push(this.props.accountState.account);
          copiedTabOfFriendID.splice(i, 1)
        }else{
          for (var j = 0; j < this.props.accountState.friends.length; j++) {
            if(this.props.accountState.friends[j].id === copiedTabOfFriendID[i]){
              newTabOfFriendID.push(this.props.accountState.friends[j])
              copiedTabOfFriendID.splice(i, 1)
            }
          }
        }
      }

      if(copiedTabOfFriendID.length>0){
        API.getUsersDataByID(copiedTabOfFriendID).then((data)=>{
          var newFullTab = newTabOfFriendID.concat(data.data.usersData);
          this.setState({[key]: newFullTab});
          //console.log(newFullTab)
        });
      }else{
          this.setState({[key]: newTabOfFriendID});
          //console.log(newTabOfFriendID)
      }

  }

  componentDidMount = () => {
    this.getFriendsWithTabId(this.props.bet.players1, "players1")
    this.getFriendsWithTabId(this.props.bet.players2, "players2")
    this.getFriendsWithTabId([this.props.bet.witness], "witness")
  }




  onClick = (context) => {
    let betWithPlayersInfo={};
    const returnedTarget = Object.assign(betWithPlayersInfo, this.props.bet);
    betWithPlayersInfo.players1 = this.state.players1
    betWithPlayersInfo.players2 = this.state.players2
    betWithPlayersInfo.witness = this.state.witness[0]
    this.props.getBetDetail(betWithPlayersInfo)
    console.log(betWithPlayersInfo.players2 )
  }

  displayWinOrLoose = () => {
    if(this.state.iWon && !this.state.imTheWitness){
      return(
        <Image style={{position:"absolute", width:20, height:20, top:30, right:20,}} source={require('../assets/images/won.png')}/>
      )
    }else if(!this.state.iWon && !this.state.imTheWitness){
      return(
        <Image style={{position:"absolute", width:20, height:20, top:30, right:20,}} source={require('../assets/images/lost.png')}/>
      )
    }else{
      return(
        <Image style={{position:"absolute", width:20, height:20, top:30, right:20,}} source={require('../assets/images/right.png')}/>
      )
    }
  }

  render(){
      if(!((this.state.players1.length>0) && (this.state.players2.length>0) && (this.state.witness.length>0))){
        return(
          <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"center", height:100, flex:1}}>
            <ActivityIndicator color={"green"} size={"large"}>
            </ActivityIndicator>
          </View>
        )
      }else{
        return(
          <TouchableOpacity onPress={this.onClick} style={{flexDirection:"row",  alignItems:"flex-start", height:100, flex:1, alignItems:"center"}}>
            <View style={{width:100, height:100}}> 
              {this.state.players1.length>0 ?
                  <View style={{width:100, height:100, position:"absolute", top:5, left:5}}>
                    {this.state.players1[0].imageProfil ?
                      <Image source={{uri:this.state.players1[0].imageProfil}} style={{borderRadius:35, width:70, height:70,}}/>
                      :
                      <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70,}}/>
                    }
                  </View>
                  :
                  <View style={{width:70, height:70, backgroundColor:"red", position:"absolute", top:5, left:5}}>
                  </View>
              }
              {this.state.players2.length>0 ?
                <View style={{width:100, height:100, position:"absolute", top:25, left:25}}>
                  {this.state.players1[0].imageProfil ?
                    <Image source={{uri:this.state.players2[0].imageProfil}} style={{borderRadius:35, width:70, height:70}}/>
                    :
                    <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70}}/>
                  }
                </View>
                :
                <View style={{width:70, height:70, backgroundColor:"red", position:"absolute", top:25, left:25}}>
                </View>
              }
            </View>
            <View style={{flex:1, flexDirection:"column", alignItems:"flex-start",justifyContent:"center"}}>
              <View style={{color:this.props.bet.current?"black":"rgba(187,187,187,1)"}}>
                <Text style={{fontSize:15}}>{this.props.bet.title}</Text>
              </View>
              <View style={{color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>
                <Text style={{fontSize:13}}>{this.props.bet.issue}</Text>
              </View>
              <View style={{color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>
                <Text style={{fontSize:10}}>{"create : "+this.props.bet.creation}</Text>
              </View>
              <View style={{color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>
                <Text style={{fontSize:10}}>{"expiration : "+this.props.bet.expiration}</Text>
              </View>
            </View>
            {this.props.bet.current?
              <Image style={{position:"absolute", width:30, height:30, top:25, right:10,}} source={require('../assets/images/right.png')}/>
              :
              this.displayWinOrLoose()
            }
          </TouchableOpacity>
        )
      }

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const BetItem = connect(mapStateToProps, mapDispatchToProps)(BetItemComponent);
  export default BetItem;
