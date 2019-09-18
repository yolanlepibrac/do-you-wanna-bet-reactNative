
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';
import { setNewBet } from "../Redux/Actions/index";

import ChooseItem from "./ChooseItem";
import API from '../Utils/API';

const sizeIconMobile = 40;

function mapDispatchToProps(dispatch) {
  return {
    setNewBet:(newBet, id) => dispatch(setNewBet(newBet, id)),
  };
};



class MyBetContainerComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      friends:[],
      judge : undefined,
      displayLoading:false,
     }
  }

  validate = (judge, friends) => {
    this.setState({displayLoading:true})
    console.log(this.state)
    if(judge!=undefined && friends.length>0){
      let today = this.dateToString(new Date());
      let id = '_' + Math.random().toString(36).substr(2, 9);
      let newBet={
        id:id,
        title:this.state.title,
        issue:this.state.issue,
        expiration:this.state.expiration===undefined || this.state.expiration===""?"never":this.state.expiration,
        creation:today,
        players1:[{id:this.props.accountState.account.id, accepted:true}],
        players2:friends.map((friend)=>({id:friend.id, accepted:undefined})),
        win:false,
        witness:judge.id,
        current:true,
      }
    API.createBet(newBet).then((data)=>{
      this.props.setNewBet(newBet)
      this.props.navigation.navigate("BetContainer1", {title:"", issue:"", expiration:"", friends:[], judge:undefined})
      this.props.navigation.navigate("BetMadeContainer")
    }).catch(error => {
      this._showAlert("the server can not be reached. Please, check your connexion !")
    });

    }
  }

  dateToString = (date) => {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;
    return date
  }

  chooseJudge = () => {
    this.props.navigation.navigate("ChooseJudge", {friends:this.state.friends, judge:this.state.judge})
  }

  chooseFriends = () => {
     this.props.navigation.navigate("ChooseFriends", {friends:this.state.friends, judge:this.state.judge})
  }

  resetJudge = () => {
    this.setState({
      judge:undefined
    })
    this.props.navigation.setParams({judge: undefined})
  }

  resetFriends = () => {
    this.setState({
      friends:[]
    })
    this.props.navigation.setParams({friends: []})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        judge : this.props.navigation.getParam('judge', undefined),
        friends : this.props.navigation.getParam('friends', []),
        title : this.props.navigation.getParam('title', ""),
        issue : this.props.navigation.getParam('issue', ""),
        expiration : this.props.navigation.getParam('expiration', ""),
      })
    }
  }


  render(){
    if(this.state.displayLoading){
      return(
        <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"center", height:100, flex:1}}>
          <ActivityIndicator color={"green"} size={"large"}>
          </ActivityIndicator>
        </View>
      )
    }else{
      return(
        <View style={{flex:1, flexDirection:"column", justifyContent:"flex-start", alignItems:"center", backgroundColor:"rgba(156, 255, 169,1)"}}>
          <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
            <ChooseItem placeholder={"Against who ?"} active={this.state.friends.length>0} delete={this.resetFriends}>
                <TouchableOpacity style={{backgroundColor:"rgba(220,220,220,0.4)", borderRadius:5, flex:1, paddingLeft:20, paddingRight:20, height:50, flexDirection:"row", alignItems:"center"}} onPress={this.chooseFriends}>
                  {this.state.friends.length>0 ?
                    <View style={{flexDirection:"row", width:210, height:30}}>
                    {this.state.friends.map((friend, key)=>
                      <View key={key} style={{position:"absolute", top:0, left:((210-15)/this.state.friends.length)*(key), borderRadius:15, backgroundColor:"white", borderWidth:1 }}>
                        {friend.imageProfil ?
                          <Image source={{uri:friend.imageProfil}} style={{borderRadius:15, width:30, height:30,}}/>
                          :
                          <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:15, width:30, height:30}}/>
                        }
                      </View>)
                    }
                    </View>
                    :
                    <Text>Pick</Text>
                  }
                </TouchableOpacity>
            </ChooseItem>
          </View>
          <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
            <ChooseItem placeholder={"Judge"} active={this.state.judge !== undefined && this.state.judge !== ""} delete={this.resetJudge}>
              <TouchableOpacity style={{backgroundColor:"rgba(220,220,220,0.4)", borderRadius:5, flex:1, paddingLeft:20, paddingRight:20, height:50, flexDirection:"row", alignItems:"center"}} onPress={this.chooseJudge}>
                {this.state.judge!=undefined ?
                  <View style={{flexDirection:"row", width:210, height:30}}>
                    <View style={{ borderRadius:15, backgroundColor:"white", borderWidth:1, marginRight:10 }}>
                      {this.state.judge.imageProfil ?
                        <Image source={{uri:this.state.judge.imageProfil}} style={{borderRadius:15, width:30, height:30,}}/>
                        :
                        <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:15, width:30, height:30}}/>
                      }
                    </View>
                    <Text>{this.state.judge.userName}</Text>
                  </View>
                  :
                  <Text>Pick</Text>
                }
              </TouchableOpacity>
            </ChooseItem>
          </View>
          <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
            <TouchableOpacity onPress={() => this.validate(this.state.judge, this.state.friends)}  style={{backgroundColor:this.state.friends.length>0 && this.state.judge!==undefined? "rgba(110,219,124,1)":"rgba(200,200,200,1)", borderWidth:this.state.friends.length>0 && this.state.judge!==undefined?1:0, borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
              <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE</Text>
            </TouchableOpacity>
          </View>
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

const MyBetContainer = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(MyBetContainerComponent));
export default MyBetContainer;
