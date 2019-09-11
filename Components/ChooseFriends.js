
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';

import FriendItem from "./FriendItem"


function mapDispatchToProps(dispatch) {
  return {
    sheetSelected:dispatch.sheetSelected,
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
    betSelected : {}
  };
};

class ChooseFriendsComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      friends:[],
      friendsToBeChoosen : [],
      judge : undefined,
     }
  }

  toggleFriend = (friend) => {
    let friends = this.state.friends
    let friendInState = false
    for (var i = 0; i < friends.length; i++) {
      if(friends[i].id === friend.id){
        friends.splice(i, 1)
        this.setState({
          friends : friends,
        })
        friendInState = true
      }
    }
    if(friendInState === false){
      friends.push(friend)
      this.setState({
        friends : friends,
      })
    }

  }


  validate = () => {
    this.props.navigation.navigate("BetContainer2", {friends:this.state.friends})
  }

  checkActive = (friend) => {
    for (var i = 0; i < this.state.friends.length; i++) {
      if(friend.id === this.state.friends[i].id ){
        return true
      }
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setFriendListWithoutJudge()
    }
  }

  componentDidMount() {
    this.setFriendListWithoutJudge()
  }

  setFriendListWithoutJudge = () => {
    let judge = this.props.navigation.getParam('judge', undefined);
    let friendsAlreadyChoosen = this.props.navigation.getParam('friends', []);
    let friendsState = [...this.props.accountState.friends];
    if(judge !== undefined && friendsState.length>0){
      for (var i = 0; i < friendsState.length; i++) {
        if(friendsState[i].id === judge.id){
          friendsState.splice(i,1)
        }
      }
    }
    this.setState({
      judge : judge,
      friendsToBeChoosen : friendsState,
      friends : friendsAlreadyChoosen,
    })
  }


  render(){
    return(
        <View style={{flex:1, flexDirection:"column"}}>
          <View style={{flexDirection:"row", justifyContent:"center", height:50, alignItems:"center", marginTop:10, marginBottom:10}} onPress={this.validate}>
            <TouchableOpacity style={{backgroundColor:"rgba(110,219,124,1)", borderWidth:1, borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:3 }} onPress={this.validate}>
              <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.friendsToBeChoosen.length>0 ?
            <ScrollView style={{flex:1, flexDirection:"column",  backgroundColor:"rgba(156, 255, 169,1)"}}>
              {this.state.friendsToBeChoosen.map((friend, key)=>{
                return <FriendItem friend={friend} chooseFriend={this.toggleFriend} active={this.checkActive(friend)} key={key}/>
              })}
            </ScrollView>
            :
            <View>
              <Text>Sorry, you don't have enought friends to make a bet
              </Text>
            </View>
          }
        </View>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux
  }
}

const ChooseFriends = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(ChooseFriendsComponent));
export default ChooseFriends;
