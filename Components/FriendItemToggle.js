
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Image } from 'react-native';
import Utils from "../Utils/Utils"
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';


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
      friend : this.props.friend
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
    this.props.onClick(this.state.friend)
  }

  openFriendDetail = () => {
    this.props.openFriend(this.state.friend)
  }

  calculjudgeNote = (tabofJudgeNote) => {
    let sum = 0
    for (var i = 0; i < tabofJudgeNote.length; i++) {
      sum = sum + tabofJudgeNote[i].note
    }
    return sum/tabofJudgeNote.length
  }


  render(){
    return(
      <View style={{flex:1, flexDirection:"row", height:70, paddingLeft:20, paddingRight:20, marginTop:10, alignItems:"center"}}>
        {this.state.friend.imageProfil ?
          <Image source={{uri:this.state.friend.imageProfil}} style={{borderRadius:30, width:60, height:60}}/>
          :
          <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:30, width:60, height:60}}/>
        }
        <View style={{flex:1, flexDirection:"row", marginLeft:20}}>
          <TouchableOpacity style={{height:60, flex:1,  flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} onPress={this.openFriendDetail}>
            <View style={{flex:1, flexDirection:"column"}}>
              <Text style={{ fontSize:18, marginBottom:5}}>{this.state.friend.userName}</Text>
              <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:23}}>{this.state.friend.bets.length}</Text><Text>{" bets"}</Text>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:23, marginLeft:10}}>{this.state.friend.won?this.state.friend.won:0}</Text><Text>{" won"}</Text>
              </View>
            </View>
            <View style={{width:90, height:40, padding:5, flexDirection:"column", marginLeft:20, marginRight:20, backgroundColor:"rgba(210,210,210,1)", borderRadius:5, borderWidth:1, borderColor:"rgba(200,200,200,1)", alignItems:"center", overflow:"hidden"}}>
              <View style={{flex:1, flexDirection:"row", alignItems:"space-between"}}>
                <View>
                  <Text style={{color:"white", fontSize:10}}>{"Judged :"}</Text>
                </View>
                <View style={{marginLeft:5}}>
                  <Text style={{color:"white", fontSize:10}}>{this.state.friend.witnessOf.length + "bets"}</Text>
                </View>
              </View>
              {Utils.displayMark(this.calculjudgeNote(this.props.friend.judgeNotes), 80)}
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

const FriendItemToggle = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(FriendItemToggleComponent));
export default FriendItemToggle;
