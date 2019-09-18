
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { connect } from "react-redux";

import FriendItemToggle from './FriendItemToggle'
import API from '../Utils/API';
import { setFriendsState } from "../Redux/Actions/index";
import { withNavigationFocus } from 'react-navigation';

const selectedColor = "rgba(123,250,155,1)";
const nonSelectedColor = "rgba(240,240,240,1)";

function mapDispatchToProps(dispatch) {
  return {
    setFriendsState: (tabOfFriends) => dispatch(setFriendsState(tabOfFriends)),
  };
};


class FriendsContainerComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchValue:"",
      searchValueSend : "",
      tabOfFriendObject:[],
      tabOfIdOfFriendsAreadyFriends:this.props.accountState.friends,
      searchActive:false,
      displayLoading:false,
      searchMade : false,
      friends : this.props.accountState.friends
     }
  }

  componentDidUpdate(prevProps){
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({friends : this.props.accountState.friends})
    }
  }

  componentDidMount = () => {
    this.setState({friends : this.props.accountState.friends})
  }

  displaySearch = () => {
    this.setState({
      searchActive : true,
    })
  }
  displayMyFriends = () => {
    this.setState({
      searchActive : false,
    })
  }

  toggleFriend = (friendToCheck) => {
    let tabOfIdOfFriends = this.state.friends
    let tabOfIdOfFriendsID = this.state.friends.map((friend)=>(friend.id))
    if(!tabOfIdOfFriendsID.includes(friendToCheck.id)){
      tabOfIdOfFriends.push(friendToCheck)
    }else{
      let index = tabOfIdOfFriendsID.indexOf(friendToCheck.id);
      if (index !== -1){
        tabOfIdOfFriends.splice(index, 1);
        tabOfIdOfFriendsID.splice(index, 1);
      }
    }
    this.props.setFriendsState(tabOfIdOfFriends)
    this.setState({
      tabOfIdOfFriendsAreadyFriends:tabOfIdOfFriends
    })
    API.toggleFriend(this.props.accountState.account.id, tabOfIdOfFriendsID).then((data)=>{
        //console.log(data.data)
    },function(error){
        //console.log(error);
        this._showAlert("the server can not be reached. Please, check your connexion !")
        return;
    })
  }

  submitResearch = () => {
      this.setState({
        displayLoading:true,
        searchValueSend : this.state.searchValue,
        searchMade : true,
      })
      console.log(this.state.searchValue)
      API.searchFriends(this.state.searchValue).then((data)=>{
        console.log(data.data.user)
        for (var i = 0; i < data.data.user.length; i++) {
          if(data.data.user[i].id === this.props.accountState.account.id){
            var result = data.data.user.splice(i, 1);
          }
        }
        this.setState({
          tabOfFriendObject : data.data.user,
          displayLoading : false
        })
      },function(error){
          console.log(error)
          this.setState({displayLoading:false})
          return;
      })
  }

  onChangeSearchValue = (searchValue) => {
    this.setState({
      searchValue:searchValue
    })
  }

  _showAlert = (errorMessage) => {
    Alert.alert(
      'Impossible to judge',
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  openFriend = (friend) => {
    this.props.navigation.navigate("FriendDetail", {friend:friend})
  }

  render(){
    return(
      <View style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"center", flex:1,}}>
        {this.state.displayLoading ?
          <View style={{flex:1, width:"100%", height:"100%", backgroundColor:"white", alignItems:"center", justifyContent:"center"}}>
            <ActivityIndicator color={'green'} size={"large"}/>
          </View>
          :
          <View style={{flex:1, flexDirection:"column", alignItems:"center", width:"100%"}}>
            <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", height:70}}>
              <TouchableOpacity
              onPress={() => this.displaySearch()}
              style={{backgroundColor:this.state.searchActive?"rgba(120,220,120,1)":"rgba(240,240,240,1)", width:130, height:40, borderBottomWidth:1, borderLeftWidth:1, borderTopWidth:1,borderBottomLeftRadius:10, borderTopLeftRadius:10, alignItems:"center", justifyContent:"center", borderColor: this.state.searchActive?"rgba(100,220,100,1)":"rgba(200,200,200,1)"}}>
                <Text style={{color:"white", fontSize:15, fontWeight:"bold"}}>SEARCH</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => this.displayMyFriends()}
              style={{backgroundColor:this.state.searchActive?"rgba(240,240,240,1)":"rgba(120,220,120,1)", width:130, height:40, borderBottomWidth:1, borderRightWidth:1, borderTopWidth:1 ,borderBottomRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, alignItems:"center", justifyContent:"center", borderColor:this.state.searchActive?"rgba(200,200,200,1)":"rgba(100,220,100,1)"}}>
                <Text style={{color:"white", fontSize:15, fontWeight:"bold"}}>MY FRIENDS</Text>
              </TouchableOpacity>
            </View>
            {this.state.searchActive ?
              <View style={{flex:1, flexDirection:"column", width:"100%", alignItems:"center"}}>
                <View style={{height:40,borderWidth:1, padding:2.5, margin:5, flexDirection:"row", alignItems:"center", width:260}}>
                  <TextInput style={{height:35,flex:1,flexDirection:"row", justifyContent:"flex-end"}} onChangeText={text=>this.onChangeSearchValue(text)} value={this.state.searchValue} onSubmitEditing={this.submitResearch}>
                  </TextInput>
                  <TouchableOpacity onPress={this.submitResearch} style={{positon:"absolute", top:0, right:0, height:40, justifyContent:"center", alignItems:"center"}}>
                    <Text>SEARCH</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:"column", flex:1, width:"100%"}}>
                  {this.state.tabOfFriendObject.length>0 ?
                    <ScrollView style={{flex:1, flexDirection:"column"}}>
                      {this.state.tabOfFriendObject.map((friend, key)=><FriendItemToggle friend={friend} key={key} onClick={this.toggleFriend} alreadyFriend={this.state.tabOfIdOfFriendsAreadyFriends.map((friend)=>(friend.id)).includes(friend.id)} navigation={this.props.navigation} openFriend={this.openFriend}/>)}
                    </ScrollView>
                    :
                    <View>
                      {this.state.searchMade && <Text>{"Impossible to find friend with the input : " + this.state.searchValue}</Text>}
                    </View>
                  }
                </View>
              </View>
              :
              <View style={{flex:1, flexDirection:"row"}}>
                <ScrollView style={{flex:1, flexDirection:"column"}}>
                  {this.state.friends.map((friend, key)=><FriendItemToggle friend={friend} key={key} onClick={this.toggleFriend} alreadyFriend={this.state.tabOfIdOfFriendsAreadyFriends.map((friend)=>(friend.id)).includes(friend.id)} navigation={this.props.navigation}
                  openFriend={this.openFriend}/>)}
                </ScrollView>
              </View>
            }
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const FriendsContainer = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(FriendsContainerComponent));
export default FriendsContainer;
