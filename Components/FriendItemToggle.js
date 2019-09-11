
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

class FriendItemToggleComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
     }
  }

  displayToggleFriend = () => {
    if(this.props.alreadyFriend){
      return <Image source={require('../assets/images/moinsWhite.png')} style={{borderRadius:15, width:30, height:30, backgroundColor:"rgba(255,10,10,0.4)", borderWidth:1}}/>
    }else{
      return <Image source={require('../assets/images/addFriend.png')} style={{borderRadius:15, width:30, height:30}}/>
    }
  }

  toggleFriend = () => {
    this.props.onClick(this.props.friend)
  }

  openFriendDetail = () => {
    this.props.navigation.navigate("FriendDetail", {friend:this.props.friend})
  }


  render(){
    return(
      <View style={{flex:1, flexDirection:"row", height:70, paddingLeft:20, paddingRight:20, marginTop:10, alignItems:"center"}}>
        {this.props.friend.imageProfil ?
          <Image source={{uri:this.props.friend.imageProfil}} style={{borderRadius:30, width:60, height:60}}/>
          :
          <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:30, width:60, height:60}}/>
        }
        <View style={{flex:1, flexDirection:"row", marginLeft:20}}>
          <TouchableOpacity style={{height:60, flex:1,  flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} onPress={this.openFriendDetail}>
            <View style={{flex:1, flexDirection:"column", borderRightWidth:1, borderColor:"black"}}>
              <Text style={{ fontSize:18, marginBottom:5}}>{this.props.friend.userName}</Text>
              <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:23}}>{this.props.friend.bets.length}</Text><Text>{" bets"}</Text>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:23}}>{this.props.friend.won?this.props.friend.won:0}</Text><Text>{" won"}</Text>
              </View>
            </View>
            <View style={{flex:1, flexDirection:"column", marginLeft:20}}>
              <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                <Text>{"Witness"}</Text><Text style={{color:"rgba(130,130,130,1)", fontSize:23}}>{this.props.friend.witnessOf.length}</Text>
              </View>
              <Text>{"3 STARS"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleFriend} style={{height:50, width:50,  flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            {this.displayToggleFriend()}
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

const FriendItemToggle = connect(mapStateToProps, mapDispatchToProps)(FriendItemToggleComponent);
export default FriendItemToggle;
