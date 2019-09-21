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


class BetJudgeContainerComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      listOfItems:this.props.accountState.witnessOf,
      refreshing : false,
     }
  }


  getBetDetail = (bet) => {
    this.props.navigation.navigate("BetDetail", {bet:bet})
  }

  makeFirstBet = () => {
    this.props.navigation.navigate("BetNavigation")
  }

  componentDidMount = () => {
    this.setState({ listOfItems:this.props.accountState.witnessOf });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({ listOfItems:this.props.accountState.witnessOf });
      //this.setState({ listOfItems : this.props.navigation.getParam('listOBet', this.props.accountState.witnessOf) })
      //console.log(this.props.navigation.getParam('listOBet', undefined))
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
      if(this.props.accountState.witnessOf.length>0){
        return(
          <ScrollView style={{flex:1, flexDirection:"column"}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}>
            {this.state.listOfItems.map((bet, key)=>{
              return <BetItem bet={bet} getBetDetail={this.getBetDetail} key={key} navigation={this.props.navigation}></BetItem>
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

  const BetJudgeContainer = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(BetJudgeContainerComponent));
  export default BetJudgeContainer;
