import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';

import BetItem from "./BetItem"
import Utils from '../Utils/Utils';

//Redux
import { changeAccountState } from "../Redux/Actions/index";
import { getUserFriends } from "../Redux/Actions/index";
import { getUserBets } from "../Redux/Actions/index";
import { getUserWitnessOf } from "../Redux/Actions/index";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    getUserBets: (tabOfBets) => dispatch(getUserBets(tabOfBets)),
    getUserFriends: (tabOfFriends) => dispatch(getUserFriends(tabOfFriends)),
    getUserWitnessOf: (tabOfWitnessOf) => dispatch(getUserWitnessOf(tabOfWitnessOf)),
  };
};


class BetMadeContainerComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      bets : this.props.accountState.bets,
      refreshing : false,
     }
  }

  getBetDetail = (bet) => {
    this.props.navigation.navigate("BetDetail", {bet:bet})
  }

  makeFirstBet = () => {
    this.props.navigation.navigate("BetNavigation")
    //console.log(this.props.accountState.bets)
    this.setState({bets:this.props.accountState.bets})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({bets:this.props.accountState.bets})
    }
  }

  onRefresh = () => {
    this.setState({refreshing:true})
    Utils.loginAlreadyConnected(this.props.accountState.account.email, this, () => {
      this.setState({refreshing:false});
      console.log("refreshed")
    })
  }


  render(){
      if(this.state.bets.length>0){
        return(
          <ScrollView style={{flex:1, flexDirection:"column"}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>} >
            {this.state.bets.map((bet, key)=>{
              return <BetItem bet={bet} getBetDetail={this.getBetDetail} key={key}></BetItem>
            })}
          </ScrollView>
        )
      }else{
        return (
          <View style={{flexDirection:"column", alignItems:"center", justifyContent:"center", paddingTop:30}}>
            <Text>You did'nt make any bet yet
            </Text>
            <TouchableOpacity style={{width:200, height:50, backgroundColor:"rgba(35,200,35,1)", borderRadius:2, marginTop:100, alignItems:"center", justifyContent:"center"}} onPress={this.makeFirstBet}>
              <Text style={{color:"white", fontWeight:"bold", fontSize:15}}>MAKE MY FIRST BET
              </Text>
            </TouchableOpacity>
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

  const BetMadeContainer = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(BetMadeContainerComponent));
  export default BetMadeContainer;
