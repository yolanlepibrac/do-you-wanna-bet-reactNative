import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from "react-redux";


import BetItem from "./BetItem"

function mapDispatchToProps(dispatch) {
  return {
  };
};


class BetJudgeContainerComponent extends React.Component {


  getBetDetail = (bet) => {
    this.props.navigation.navigate("BetDetail", {bet:bet})
  }

  makeFirstBet = () => {
    this.props.navigation.navigate("BetNavigation")
  }


  render(){
      if(this.props.accountState.witnessOf.length>0){
        return(
          <ScrollView style={{flex:1, flexDirection:"column"}}>
            {this.props.accountState.witnessOf.map((bet, key)=>{
              return <BetItem bet={bet} getBetDetail={this.getBetDetail} key={key}></BetItem>
            })}
          </ScrollView>
        )
      }else{
        return (
          <View style={{flexDirection:"column", alignItems:"center", justifyContent:"center", paddingTop:30}}>
            <Text>You are not the judge of other bet, come to check later
            </Text>
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

  const BetJudgeContainer = connect(mapStateToProps, mapDispatchToProps)(BetJudgeContainerComponent);
  export default BetJudgeContainer;
