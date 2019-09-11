
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

class ChooseJudgeComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      judge:undefined,
      friends :[],
     }
  }

  chooseFriend = (judge) => {
    this.props.navigation.navigate("BetContainer2", {judge:judge})
  }


  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setJudgeListWithoutFriendsSelected()
    }
  }

  componentDidMount() {
    this.setJudgeListWithoutFriendsSelected()
  }

  setJudgeListWithoutFriendsSelected = () => {
    let judge = this.props.navigation.getParam('judge', undefined);
    let friendsAlreadyChoosen = this.props.navigation.getParam('friends', []);
    let friendsState = [...this.props.accountState.friends];
    if(friendsAlreadyChoosen.length>0 && friendsState.length>0){
      for (var i = 0; i < friendsAlreadyChoosen.length; i++) {
        for (var j = 0; j < friendsState.length; j++) {
          if(friendsAlreadyChoosen[i].id === friendsState[j].id){
            friendsState.splice(j,1)
          }
        }
      }
    }
    this.setState({
      judge : judge,
      friends : friendsState,
    })
  }



  render(){

      if(this.state.friends.length>0){
        return(
          <ScrollView style={{flex:1, flexDirection:"column",  backgroundColor:"rgba(156, 255, 169,1)"}}>
            {this.state.friends.map((judge, key)=>{
              return <FriendItem friend={judge} chooseFriend={() =>this.chooseFriend(judge)} active={false} key={key}/>
            })}
          </ScrollView>
        )
      }else{
        return(
          <View>
            <Text>Sorry, you don't have enought friends to choose a judge
            </Text>
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

const ChooseJudge = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(ChooseJudgeComponent));
export default ChooseJudge;
