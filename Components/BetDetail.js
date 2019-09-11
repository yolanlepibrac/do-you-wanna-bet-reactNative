import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";
import API from '../Utils/API';


function mapDispatchToProps(dispatch) {
  return {
  };
};


class BetDetailComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      chooseWinner:false
     }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        bet : this.props.navigation.getParam('bet', undefined),
      })
    }
  }

  componentDidMount = () => {
    this.setState({
      bet : this.props.navigation.getParam('bet', undefined),
    })
    console.log(this.state.bet)
  }

  toggleChooseWinner = () => {
    this.setState({chooseWinner:!this.state.chooseWinner})
  }

  setWin = () => {
    let bet = this.state.bet
    bet.win = true
    bet.current = false
    this.setState({bet:bet})
  }

  setLoose = () => {
    let bet = this.state.bet
    bet.win = false
    bet.current = false
    this.setState({bet:bet})
  }

  cancelWinner = () => {
    let bet = this.state.bet
    bet.win = false
    bet.current = true
    this.setState({bet:bet, chooseWinner:!this.state.chooseWinner})
  }

  tabOfPlayer = (chooseAllowed) => {
    return (
      <View style={{flex:1, flexDirection:"row", justifyContent:"space-between", padding:10, height:300}}>
        <View style={{flex:1,  flexDirection:"column", marginRight:5,}}>
          {chooseAllowed ?
            <TouchableOpacity onPress={this.setWin} style={{height:40, width:"100%", backgroundColor:"rgba(110,219,124,1)", borderRadius:3, justifyContent:"center", alignItems:"center"}}>
              <Text style={{color:"white"}}>WINNER  IS</Text>
            </TouchableOpacity>
            :
            null
          }
          <ScrollView style={{flex:1,  flexDirection:"column", backgroundColor:this.state.bet.current?"rgba(245,245,245,1)":this.state.bet.win?"rgba(170,245,170,0.3)":"rgba(245,170,170,0.3)" }}
          onClick={this.setWin}>
            {this.state.bet.players1.map((player, key)=>
                <View style={{flexDirection:"row", width:"100%", padding:3, justifyContent:"space-between", alignItems:"center", overflow:"hidden"}} key={key}>
                  {player.imageProfil ?
                    <Image source={{uri:player.imageProfil}} style={{borderRadius:25, width:50, height:50}}/>
                    :
                    <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:25, width:50, height:50}}/>
                  }
                  <View style={{height:50,  alignItems:"center", justifyContent:"center", width:"100%", overflow:"hidden"}}>
                    <Text>{player.userName}</Text>
                  </View>
                </View>
            )}
            </ScrollView>
          </View>
          <View style={{flex:1,  flexDirection:"column",marginLeft:5}}>
            {chooseAllowed ?
              <TouchableOpacity onPress={this.setLoose} style={{height:40, width:"100%", backgroundColor:"rgba(110,219,124,1)", borderRadius:3, justifyContent:"center", alignItems:"center"}}>
                <Text style={{color:"white"}}>WINNER  IS</Text>
              </TouchableOpacity>
              :
              null
            }
            <ScrollView style={{flex:1, flexDirection:"column",  backgroundColor:this.state.bet.current?"rgba(245,245,245,1)":this.state.bet.win?"rgba(245,170,170,0.3)":"rgba(170,245,170,0.3)"}}
            onClick={this.setLoose}>
              {this.state.bet.players2.map((player, key)=>
                <View style={{flexDirection:"row", width:"100%", padding:3, justifyContent:"space-between", alignItems:"center", overflow:"hidden"}} key={key}>
                  {player.imageProfil ?
                    <Image source={{uri:player.imageProfil}} style={{borderRadius:25, width:50, height:50}}/>
                    :
                    <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:25, width:50, height:50}}/>
                  }
                  <View style={{height:50,  alignItems:"center", justifyContent:"center", width:"100%"}}>
                    <Text>{player.userName}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
    )
  }

  render(){
      return(
          <View style={{flex:1}}>
            {this.state.bet !== undefined ?
            <View style={{flex:1, paddingLeft:20, paddingRight:20, flexDirection:"column", alignItems:"center"}}>
              <View style={{flex:0.75, fontSize:17, color:"black",  flexDirection:"column", alignItems:"center", justifyContent:"center", paddingBottom:5, paddingTop:5}}>
                <Text style={{fontSize:17}}>{this.state.bet.title}</Text>
                <Text style={{color:"rgba(155,155,155,1)", fontSize:15}}>{this.state.bet.issue}</Text>
              </View>

              <View style={{flex:1,flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginTop:20, width:"100%"}}>
                <View style={{ flexDirection:"column", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <Text style={{height:20,  alignItems:"center"}}>{"creation : " + this.state.bet.creation}</Text>
                  <Text style={{height:20,alignItems:"center"}}>{"expiration : " + this.state.bet.expiration}</Text>
                  {this.state.bet.current ?
                    <Text style={{height:20,  alignItems:"center"}}>status : actual</Text>
                    :
                    <Text style={{height:20, alignItems:"center"}}>status : finished</Text>
                  }
                </View>
                {this.state.bet.witness ?
                  <View style={{flexDirection:"column", justifyContent:"space-between", alignItems:"center", width:70, backgroundSize:"cover"}}>
                    {this.state.bet.witness.imageProfil ?
                      <Image source={{uri:this.state.bet.witness.imageProfil}} style={{borderRadius:35, width:70, height:70,}}/>
                      :
                      <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70,}}/>
                    }
                    <Text style={{height:20, alignItems:"center"}}>{"Judge : " + this.state.bet.witness.userName}</Text>
                  </View>
                  :null
                }
              </View>

              <View style={{flex:4, flexDirection:"column", alignItems:"center", marginTop:30}}>
                <Text>PLAYERS</Text>
                <Text style={{width:50, height:50, position:"absolute", top:"45%", left:"45%", fontSize:30, color:"white", textShadowColor:'rgba(0,0,0,0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10, zIndex:100}}>VS
                </Text>
                {this.tabOfPlayer(false)}
              </View>

              {(this.state.judingAllow && this.state.judgmentMade) ?
                <View style={{flex:1,}}>
                  <TouchableOpacity onPress={this.toggleChooseWinner} style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                    <Text style={{color:"white", fontWeight:"bold"}}>CHOOSE WINNER</Text>
                  </TouchableOpacity>
                </View>
                :null
              }
            </View>
            :null
          }
          {this.state.chooseWinner ?
            <View style={{position:"absolute", top:0, width:0, flex:1, width:"100%", height:"100%", backgroundColor:"rgba(255,255,255,0.95)", zIndex:101}}>
              <View style={{position:"absolute", top:50, left:"10%", width:"80%", height:400, alignItems:"center", flexDirection:"column", zIndex:102}}>
                {this.tabOfPlayer(true)}
                <TouchableOpacity onPress={this.toggleChooseWinner} style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                  <Text style={{color:"white", fontWeight:"bold"}}>VALIDATE</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cancelWinner} style={{backgroundColor:"rgba(200,200,200,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2, marginTop:7 }}>
                  <Text style={{color:"white", fontWeight:"bold"}}>CANCEL WINNER</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            null
          }
          </View>
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const BetDetail = connect(mapStateToProps, mapDispatchToProps)(BetDetailComponent);
  export default BetDetail;
