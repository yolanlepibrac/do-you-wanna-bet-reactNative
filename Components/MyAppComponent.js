
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { connect } from "react-redux";

import YolanHeader from './YolanHeader';
import NoAccount from './NoAccount';
import Navigation from './Navigation'





export default class MyAppComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {

     }
  }




  render(){
    return (
      <View style={{flex:1, flexDirection:"column", justifyContent:"flex-start", alignItems:"center"}}>
        <YolanHeader height={30} fontSize={15} backgroundColor={'rgba(0, 125, 33,1)'}>Do you wanna bet ?
        </YolanHeader>
        <View style={{flex:1,  flexDirection:"row"}}>
          <Navigation/>
        </View>
      </View>
    );
  }
}
