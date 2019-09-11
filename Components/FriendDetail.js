
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { connect } from "react-redux";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { ProgressCircle }  from 'react-native-svg-charts'


function mapDispatchToProps(dispatch) {
  return {
    sheetSelected:dispatch.sheetSelected,
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
    betSelected : {}
  };
};

class FriendDetailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myMark : 0,
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

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        friend : this.props.navigation.getParam('friend', undefined),
      })
    }
  }

  componentDidMount() {
    this.getPermissionAsync();
      this.setState({
        friend : this.props.navigation.getParam('friend', undefined),
      })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to create your account ! Don\'t worry, we will never use it againt you');
      }
    }
  }

  toggleRankFriend = () => {
    let friendWasWitnessOfMyBet = false
    for (var i = 0; i < this.props.accountState.bets.length; i++) {
      if(this.props.accountState.bets[i].current === false){
        if(this.props.accountState.bets[i].witness === this.state.friend.id){
          friendWasWitnessOfMyBet = true
        }
      }
    }
    if(!friendWasWitnessOfMyBet){
      this.setState({rankOpen:true})
    }else{
      this._showAlert("This guy never judge one of you bet")
    }
  }

  _showAlert = (errorMessage) => {
    Alert.alert(
      'Impossible to judge',
      errorMessage,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  displayStars = (mark) => {
    switch(mark) {
      case 5 :
        return <Image source={require('../assets/images/stars5.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 4.5 :
        return <Image source={require('../assets/images/stars45.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 4 :
        return <Image source={require('../assets/images/stars4.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 3.5 :
        return <Image source={require('../assets/images/stars35.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 3:
        return <Image source={require('../assets/images/stars3.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 2.5 :
        return <Image source={require('../assets/images/stars25.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 2 :
        return <Image source={require('../assets/images/stars2.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 1.5 :
        return <Image source={require('../assets/images/stars15.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 1 :
        return <Image source={require('../assets/images/stars1.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 0.5 :
        return <Image source={require('../assets/images/stars05.png')} style={{borderRadius:75, width:300, height:50}}/>;
      case 0 :
        return <Image source={require('../assets/images/stars0.png')} style={{borderRadius:75, width:300, height:50}}/>;
      default:
        return null;
    }
  }

  setRank = (value) => {
    this.setState({
      myMark:value
    })
  }



  render(){
    if(this.state.friend !== undefined){
      return(
        <View style={{flex:1, flexDirection:"column",marginTop:10, alignItems:"center", justifyContent:"center", paddingLeft:20, paddingRight:20}}>
          <View style={{height:170, flexDirection:"row"}}>
            {this.state.friend.imageProfil ?
              <Image source={{uri:this.state.friend.imageProfil}} style={{borderRadius:75, width:150, height:150}}/>
              :
              <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:75, width:150, height:150}}/>
            }
            <View style={{flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <Text style={{fontSize:30}}>{this.state.friend.userName}</Text>
              <Text style={{fontSize:30, color:"rgba(100,100,100,1)"}}>{this.state.friend.email}</Text>
            </View>
          </View>
          <View style={{width:"100%", height:1, backgroundColor:"rgba(100,100,100,1)", flexDirection:"row"}}>
          </View>

          <View style={{flex:1, flexDirection:"row", marginTop:30, justifyContent:"space-between", width:"100%"}}>
              <View style={{flexDirection: 'column', alignItems:"flex-start"}}>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets made  : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.bets.length}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets won   : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.state.won}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"bets lost  : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{(this.state.numberOfBetsFinished-this.state.won)}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"witness of : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.witnessOf.length}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:"flex-start"}}>
                  <Text style={{width:100, fontSize:15}}>{"friends    : "}</Text>
                  <Text style={{width:50, fontSize:20, color:"grey"}}>{this.props.accountState.friends.length}</Text>
                </View>
              </View>

              <View style={{ width:160, height:160, alignItems:"center", justifyContent:"center"}}>
                <ProgressCircle style={{height:160,width:160, position:"absolute", top:0, right:0}} progress={this.state.percentWon?this.state.percentWon:0} strokeWidth={30} progressColor={'rgb(134, 255, 155)'} backgroundColor={'rgb(255, 200,200)'} cornerRadius={2}/>
                <View style={{height:160,width:160, position:"absolute", top:0, right:0, alignItems:"center", justifyContent:"center"}}>
                  <Text style={{fontSize:35}}>{this.state.percentWon?this.state.percentWon*100 + "%":"0%"}
                  </Text>
                </View>
              </View>

          </View>

          <View style={{width:"100%", height:1, backgroundColor:"rgba(100,100,100,1)", flexDirection:"row"}}>
          </View>
          <View style={{flex:1, flexDirection:"column", marginTop:30, alignItems:"flex-start"}}>
            <View style={{height:50, flexDirection:"row", alignItems:"center"}}>
              <Text>{"Judge   "}</Text><Text style={{color:"rgba(130,130,130,1)", fontSize:25}}>{this.state.friend.witnessOf.length}</Text>
            </View>
            {this.state.friend.judgeNote ?
              <TouchableOpacity onPress={this.rankFriend}>
              {this.displayStars(Math.floor(this.state.friend.judgeNote*2)/2)}
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.toggleRankFriend} style={{backgroundColor:"rgba(110,219,124,1)", borderWidth:0, borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                <Text style={{color:"white", fontWeight:"bold"}}>Rank my friend</Text>
              </TouchableOpacity>
            }
          </View>
          {this.state.rankOpen ?
            <View style={{position:"absolute", top:0, width:0, flex:1, width:"100%", height:"100%", backgroundColor:"rgba(255,255,255,0.95)", zIndex:101}}>
              <View style={{position:"absolute", top:50, left:"10%", width:"80%", height:100, alignItems:"center", flexDirection:"column", zIndex:102}}>
                <View style={{position:"absolute", top:0, left:0, width:250, height:70, alignItems:"center", flexDirection:"column", zIndex:103}}>
                  {this.displayStars(Math.floor(this.state.myMark*2)/2)}
                </View>
                <View style={{position:"absolute", top:0, left:0, width:250, height:70, alignItems:"center", flexDirection:"row", zIndex:104}}>
                  <TouchableOpacity onPress={()=>this.setRank(1)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0.2)"}}>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setRank(2)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0.2)"}}>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setRank(3)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0.2)"}}>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setRank(4)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0.2)"}}>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setRank(5)} style={{width:50, height:50, backgroundColor:"rgba(0,0,100,0.2)"}}>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={this.toggleRankFriend}  style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE</Text>
              </TouchableOpacity>
            </View>
            :
            null
          }

        </View>
      )
    }else{
      return(
        <View style={{flex:1, flexDirection:"column", height:70, paddingLeft:20, paddingRight:20, marginTop:10, alignItems:"center", justifyContent:"center"}}>
          <ActivityIndicator size={"large"} color={"green"}/>
        </View>
      )
    }

  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux
  }
}

const FriendDetail = connect(mapStateToProps, mapDispatchToProps)(FriendDetailComponent);
export default FriendDetail;
