
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
      return (
        <View style={{flexDirection:'row', borderRadius:10, borderWidth:1, borderColor:"rgba(220,220,220,1)", backgroundColor:"rgba(255,10,10,0.4)",  padding:5}}>
          <Text style={{color:"white", width:50}}>Delete</Text>
            {/*
            <Image source={require('../assets/images/moinsWhite.png')} style={{borderRadius:15, width:30, height:30, backgroundColor:"rgba(255,10,10,0.4)", borderWidth:1}}/>
            */}

        </View>
      )
    }else{
      return <Image source={require('../assets/images/addFriend.png')} style={{borderRadius:15, width:40, height:40}}/>
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
    <View style={{flex:1, flexDirection:"column"}}>
      <View style={{width:"90%", borderBottomColor:"rgba(220,220,220,1)", marginLeft:"5%", borderBottomWidth:1, }}>
      </View>

      <View style={{flex:1, flexDirection:"row", paddingLeft:20, paddingRight:20, alignItems:"center", marginTop:5, marginBottom:5}}>
        {this.state.friend.imageProfil ?
          <Image source={{uri:this.state.friend.imageProfil}} style={{borderRadius:35, width:70, height:70}}/>
          :
          <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70}}/>
        }
        <View style={{flex:1, flexDirection:"row", marginLeft:20}}>
          <TouchableOpacity style={{flex:1, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} onPress={this.openFriendDetail}>
            <View style={{flex:1, flexDirection:"column"}}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={{ fontSize:18, color:"black"}}>{this.state.friend.userName}</Text>
              <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:20}}>{this.state.friend.bets.length}</Text><Text>{" bets"}</Text>
                <Text style={{color:"rgba(130,130,130,1)", fontSize:20, marginLeft:10}}>{this.state.friend.won?this.state.friend.won:0}</Text><Text>{" won"}</Text>
              </View>

              <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                <Text style={{fontSize:18}}>{"Judge "}</Text>
                {Utils.displayMark(this.calculjudgeNote(this.props.friend.judgeNotes), 80)}
                <Text style={{fontSize:18, marginLeft:1}}>{" " + this.state.friend.witnessOf.length + "x"}</Text>
              </View>


            </View>

          </TouchableOpacity>
        </View>
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
