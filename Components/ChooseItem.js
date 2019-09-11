import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity,Image } from 'react-native';
import { connect } from "react-redux";
import {BoxShadow} from 'react-native-shadow'

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (article) => dispatch(changeAccountState(article)),
    accountStateRedux:dispatch.accountStateRedux,
    sheetSelected:dispatch.sheetSelected,
  };
};

class ChooseItemComponent extends React.Component {

  logout = () => {

    ///this.props.logout()
  }

  render(){
    return(

        <View style={{ flexDirection:"column", justifyContent:"center", alignItems:"center", borderRadius:10, padding:1,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
        shadowOffset: {
          height: 0,
          width: 0
        }}}>
          <View style={{width:250, height:50, backgroundColor:this.props.active?"rgba(110, 219, 124,1)":"rgba(200,200,200,1)", borderTopLeftRadius:10, borderTopRightRadius:10, borderColor:"rgba(220,220,220,1)", justifyContent :"space-between", alignItems:"center", paddingLeft:20, paddingRight:20, flexDirection:"row"}}>
            <Text style={{color:"white"}}>{this.props.placeholder}</Text>
            {this.props.active?
              <TouchableOpacity onPress={()=>this.props.delete()}>
                <Image source={require('../assets/images/quit.png')} style={{width: 30,height: 30}}/>
              </TouchableOpacity>
              :null
            }
          </View>
          <View style={{width:250, height:50, backgroundColor:"rgba(235,235,235,1)",borderWidth:this.props.active?2:0, borderColor:"rgba(110, 219, 124,1)", borderBottomLeftRadius:10, borderBottomRightRadius:10, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            {this.props.children}
          </View>
        </View>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const ChooseItem = connect(mapStateToProps, mapDispatchToProps)(ChooseItemComponent);
  export default ChooseItem;
