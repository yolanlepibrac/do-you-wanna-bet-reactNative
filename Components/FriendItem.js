
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Image } from 'react-native';
import { connect } from "react-redux";



function mapDispatchToProps(dispatch) {
  return {
    sheetSelected:dispatch.sheetSelected,
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
    betSelected : {}
  };
};

class FriendItemComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
     }
  }

  choose = () => {
    this.props.chooseFriend(this.props.friend)
  }


  render(){
    return(
      <View style={{flex:1, flexDirection:"row", backgroundColor:this.props.active?"rgba(200, 255, 200,1)":"rgba(245, 245, 245,1)"}}>
        {this.props.friend.imageProfil ?
          <Image source={{uri:this.props.friend.imageProfil}} style={{borderRadius:30, width:60, height:60}}/>
          :
          <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:30, width:60, height:60}}/>
        }
        <TouchableOpacity onPress={this.choose} style={{height:50, flex:1, marginLeft:20,  flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
          <Text>{this.props.friend.userName}</Text>
        </TouchableOpacity>
      </View>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux
  }
}

const FriendItem = connect(mapStateToProps, mapDispatchToProps)(FriendItemComponent);
export default FriendItem;
