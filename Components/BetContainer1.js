
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Platform, DatePickerIOS, DatePickerAndroid, Button } from 'react-native';
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';

import ChooseItem from "./ChooseItem"

const sizeIconMobile = 40;

function mapDispatchToProps(dispatch) {
  return {
    sheetSelected:dispatch.sheetSelected,
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
    betSelected : {}
  };
};

class MyBetContainerComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title:"",
      issue : "",
      created : "",
      expiration: undefined,
      date:new Date(),
     }
  }

  navigate = () => {
    if(this.state.title.length>0 && this.state.issue.length>0){
      this.props.navigation.navigate("BetContainer2Navigation", {title:this.state.title, issue:this.state.issue, expiration:this.state.expiration})
    }
  }

  onChangeTitle = (text) => {
    this.setState({title:text})
  }

  resetTitle = () => {
    this.setState({title:""})
  }

  onChangeIssue = (text) => {
    this.setState({issue:text})
  }

  resetIssue = () => {
    this.setState({issue:""})
  }


  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        title : this.props.navigation.getParam('title', ""),
        issue : this.props.navigation.getParam('issue', ""),
        expiration : this.props.navigation.getParam('expiration', undefined),
      })
    }
  }

  setDate = (event, date) => {
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date : date,
      expiration : this.dateToString(date),
    });
  }

  dateToString = (date) => {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;
    return date
  }

  resetDate = () => {
    this.setState({
      expiration: undefined,
      date:new Date(),
    })
  }

  setDateAndroid = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        minDate : new Date(),
        date: new Date(),
        mode: "default",
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        let realMonth = month+1
        console.log(realMonth)
        let newDay = day<10?"0"+day:day;
        let newMonth = realMonth<10?"0"+realMonth:realMonth;
        let date = newDay + "/" + newMonth + "/" + year
        this.setState({expiration:date})
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }



  render(){
    return(
      <View style={{flex:1, flexDirection:"column", justifyContent:"flex-start", alignItems:"center", backgroundColor:"rgba(156, 255, 169,1)"}}>
        <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
          <ChooseItem placeholder={"What ?"} active={this.state.title.length>0} delete={this.resetTitle}>
            <View style={{flex:1, paddingLeft:20, paddingRight:20}}>
              <TextInput style={{borderWidth:0.5, borderColor:"rgba(100,100,100,0.4)", borderRadius:5, paddingLeft:5}} onChangeText={text => this.onChangeTitle(text)} value={this.state.title} onSubmitEditing={() => {this.price.focus(); }} placeholder = "What is you bet"/>
            </View>
          </ChooseItem>
        </View>
        <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
          <ChooseItem placeholder={"Price ?"} active={this.state.issue.length>0} delete={this.resetIssue}>
            <View style={{flex:1, paddingLeft:20, paddingRight:20}}>
              <TextInput style={{borderWidth:0.5, borderColor:"rgba(100,100,100,0.4)", borderRadius:5, paddingLeft:5}} onChangeText={text => this.onChangeIssue(text)} value={this.state.issue} ref={(input) => { this.price = input; }} placeholder = "What do you win"/>
            </View>
          </ChooseItem>
        </View>
        <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
          <ChooseItem placeholder={"When ?"} active={this.state.expiration!==undefined && this.state.expiration!==""} delete={this.resetDate}>
            {Platform.OS === 'ios' ?
              <DatePickerIOS  date={this.state.date} onDateChange={this.setDate}/>
              :
              <TouchableOpacity onPress={this.setDateAndroid} title="Pick date" style={{flex:1, paddingLeft:20, paddingRight:20, height:50, justifyContent:"center"}}>
                {this.state.expiration?
                  <View><Text>{this.state.expiration}</Text></View>
                  :
                  <View><Text style={{color:"grey"}}>Pick the date</Text></View>
                }
              </TouchableOpacity>
            }
          </ChooseItem>
        </View>
        <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
          <TouchableOpacity onPress={() => this.navigate()}  style={{backgroundColor:this.state.title.length>0 && this.state.issue.length>0 ? "rgba(110,219,124,1)":"rgba(200,200,200,1)", borderWidth:this.state.title.length>0 && this.state.issue.length>0 ?1:0, borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
            <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux
  }
}

const MyBetContainer = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(MyBetContainerComponent));
export default MyBetContainer;
