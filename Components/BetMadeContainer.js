import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from "react-redux";
import { setNewBet } from "../Redux/Actions/index";
import { withNavigationFocus } from 'react-navigation';

import BetItem from "./BetItem"

function mapDispatchToProps(dispatch) {
  return {
    setNewBet:(newBet, id) => dispatch(setNewBet(newBet, id)),
  };
};


class BetMadeContainerComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      bets : this.props.accountState.bets
     }
  }

  getBetDetail = (bet) => {
    this.props.navigation.navigate("BetDetail", {bet:bet})
  }

  makeFirstBet = () => {
    //this.props.navigation.navigate("BetNavigation")
    console.log(this.props.accountState.bets)
    this.setState({bets:this.props.accountState.bets})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({bets:this.props.accountState.bets})
    }
  }


  render(){
      if(this.state.bets.length>0){
        return(
          <ScrollView style={{flex:1, flexDirection:"column"}}>
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
