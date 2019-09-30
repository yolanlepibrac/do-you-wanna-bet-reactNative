import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from "react-redux";
import { setWinner } from "../Redux/Actions/index";
import { acceptBet } from "../Redux/Actions/index";
import { withNavigationFocus } from 'react-navigation';
import API from '../Utils/API';


function mapDispatchToProps(dispatch) {
  return {
    setWinner : (bet, players1, players2) => dispatch(setWinner(bet, players1, players2)),
    acceptBet: (betID, accepted) => dispatch(acceptBet(betID, accepted)),
  };
};


class BetDetailComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      chooseWinner:false,
     }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setBetInState()
    }
  }

  componentDidMount = () => {
    this.setBetInState()
  }

  setBetInState = () => {
    let bet = this.props.navigation.getParam('bet', undefined);
    let player1Exists = false;
    let player2Exists = false;
    for (var i = 0; i < bet.playersDetail.players1.length; i++) {
      if(bet.playersDetail.players1[i].accepted === true){
        player1Exists = true
      }
    }
    for (var i = 0; i < bet.playersDetail.players2.length; i++) {
      if(bet.playersDetail.players2[i].accepted === true){
        player2Exists = true
      }
    }
    this.setState({player2Exists : player2Exists, player1Exists : player1Exists})
    if(bet.playersDetail.witness.user.id === this.props.accountState.account.id){
      this.setState({judingAllow : true})
    }
    this.setState({bet : bet, currentWhenBeggin:bet.current})
  }

  toggleChooseWinner = () => {
    this.setState({chooseWinner:!this.state.chooseWinner})
  }

  validateWinner = () => {
    this.setState({chooseWinner:false, displayLoading:true})
    console.log(this.state.bet.players1)
    console.log(this.state.bet.players2)
    console.log(this.state.currentWhenBeggin)
    API.setWinner(this.state.bet, this.state.bet.win, this.state.currentWhenBeggin).then((data)=>{
      this.props.setWinner(data.data.bet, data.data.users.players1, data.data.users.players2 )
      this.setState({currentWhenBeggin:false})
      let newAccountState = this.props.accountState
      for (var i = 0; i < newAccountState.witnessOf.length; i++) {
        if(newAccountState.witnessOf[i].id === data.data.bet.id){
          newAccountState.witnessOf[i] = data.data.bet
        }
      }
      this.props.navigation.setParams({listOBet : newAccountState})
      console.log("player1 won " + data.data.users.players1[0].won)
      console.log("player1 lost " + data.data.users.players1[0].lost)
      console.log("player2 won " + data.data.users.players2[0].won)
      console.log("player2 lost " +data.data.users.players2[0].lost)
      this.setState({ displayLoading:false})
    }).catch((error)=>{
      console.log(error)
      this.setState({ displayLoading:false})
    })
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

  accept = (accepted) => {
    let bet = this.state.bet
    bet.iAccepted = accepted
    this.setState({bet : bet})
    let newAccountState = this.props.accountState
    let newBet = {}
    let newAccount = {}
    let uniqueBet = {}
    console.log(this.state.bet)
    for (var i = 0; i < newAccountState.account.bets.length; i++) {
      if(typeof newAccountState.account.bets[i] === "string"){
        newAccountState.account.bets[i] = {id:newAccountState.account.bets[i], accepted:undefined}
      }
      if(newAccountState.account.bets[i].id === this.state.bet.id){
        newAccountState.account.bets[i].accepted = accepted;
        newAccount = newAccountState.account
        uniqueBet = newAccountState.account.bets[i]
      }
    }
    for (var i = 0; i < newAccountState.bets.length; i++) {
      if(newAccountState.bets[i].id === this.state.bet.id){
        for (var j = 0; j < newAccountState.bets[i].players1.length; j++) {
          if(typeof newAccountState.bets[i].players1[j] === "string"){
            newAccountState.bets[i].players1[j] = {id:newAccountState.bets[i].players1[j], accepted:undefined}
          }
          if(newAccountState.bets[i].players1[j].id === newAccountState.account.id){
            newAccountState.bets[i].players1[j].accepted = accepted;
            newBet = newAccountState.bets[i]
          }
        }
        for (var j = 0; j < newAccountState.bets[i].players2.length; j++) {
          if(typeof newAccountState.bets[i].players2[j] === "string"){
            newAccountState.bets[i].players2[j] = {id:newAccountState.bets[i].players2[j], accepted:undefined}
          }
          if(newAccountState.bets[i].players2[j].id === newAccountState.account.id){
            newAccountState.bets[i].players2[j].accepted = accepted;
            newBet = newAccountState.bets[i]
          }
        }
      }
    }

    API.acceptBet(newAccount, newBet, accepted).then((data)=>{
      this.props.acceptBet(newAccount, newBet)
      console.log(newBet)
      console.log("is update")
    })
  }



  tabOfPlayer = (chooseAllowed) => {
    return (
      <View style={{flex:1, flexDirection:"row", justifyContent:"space-between", padding:10}}>
        <View style={{flex:1,  flexDirection:"column", marginRight:5,}}>
          {chooseAllowed ?
            <TouchableOpacity onPress={this.setWin} style={{height:40, width:"100%", backgroundColor:"rgba(110,219,124,1)", borderRadius:3, justifyContent:"center", alignItems:"center"}}>
              <Text style={{color:"white"}}>WINNER  IS</Text>
            </TouchableOpacity>
            :
            null
          }
          <ScrollView nestedScrollEnabled={true} style={{flex:1, borderRadius:25, flexDirection:"column", backgroundColor:this.state.bet.current||this.state.bet.isPassed?"rgba(245,245,245,1)":this.state.bet.win?"rgba(170,245,170,0.3)":"rgba(245,170,170,0.3)" }}
          onClick={this.setWin}>
            {this.state.bet.playersDetail.players1.map((player, key)=>
                <View style={{flexDirection:"row", width:"100%", padding:3, justifyContent:"space-between", alignItems:"center", overflow:"hidden"}} key={key}>
                  {player.user.imageProfil ?
                    <Image source={{uri:player.user.imageProfil}} style={{borderRadius:25, width:50, height:50}}/>
                    :
                    <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:25, width:50, height:50}}/>
                  }
                  <View style={{height:50,  alignItems:"center", justifyContent:"center", width:"100%", overflow:"hidden"}}>
                    <Text>{player.user.userName}</Text>
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
            <ScrollView nestedScrollEnabled={true} style={{flex:1, borderRadius:25, flexDirection:"column",  backgroundColor:this.state.bet.current||this.state.bet.isPassed?"rgba(245,245,245,1)":this.state.bet.win?"rgba(245,170,170,0.3)":"rgba(170,245,170,0.3)"}}
            onClick={this.setLoose}>
              {this.state.bet.playersDetail.players2.map((player, key)=>
                <View key={key}>
                    <View style={{flexDirection:"row", width:"100%", padding:3, justifyContent:"space-between", alignItems:"center", overflow:"hidden", opacity:player.accepted?1:0.3}}>
                      {player.user.imageProfil ?
                        <Image source={{uri:player.user.imageProfil}} style={{borderRadius:25, width:50, height:50}}/>
                        :
                        <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:25, width:50, height:50}}/>
                      }
                      <View style={{height:50,  alignItems:"center", justifyContent:"center", width:"100%"}}>
                        {player.accepted === false ?
                          <Text>REFUSED</Text>
                          :
                          <Text>{player.user.userName}</Text>
                        }
                      </View>
                    </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
    )
  }

  render(){

        if(this.state.displayLoading){
          return <ActivityIndicator color={"green"} size={"large"}></ActivityIndicator>
        }else{
        return(
        <View style={{flex:1}}>
          <ScrollView nestedScrollEnabled={true} style={{flex:1}}>
            {this.state.bet !== undefined ?
            <View style={{flex:1, paddingLeft:20, paddingRight:20, flexDirection:"column", alignItems:"center"}}>
              <View style={{flex:0.75, fontSize:17, color:"black",  flexDirection:"column", alignItems:"center", justifyContent:"center", paddingBottom:5, paddingTop:5, width:"100%"}}>
                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"center", width:"100%"}}>
                  <Text style={{fontWeight:"bold", color:"black"}}>Title</Text>
                  <Text style={{fontSize:17, textAlign:"justify"}}>{this.state.bet.title}</Text>
                </View>
                <View style={{flexDirection:"column", alignItems:"flex-start", justifyContent:"center", marginTop:20, width:"100%"}}>
                  <Text style={{fontWeight:"bold", color:"black"}}>Price</Text>
                  <Text style={{color:"rgba(155,155,155,1)", fontSize:15, textAlign:"justify"}}>{this.state.bet.issue}</Text>
                </View>
              </View>



              <View style={{flex:1,flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginTop:20, width:"100%"}}>
                <View style={{ flexDirection:"column", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <Text style={{fontWeight:"bold", color:"black"}}>Details</Text>
                  <Text style={{height:20,  alignItems:"center"}}>{"creation : " + this.state.bet.creation}</Text>
                  <Text style={{height:20,alignItems:"center"}}>{"expiration : " + this.state.bet.expiration}</Text>
                  {this.state.bet.current&&!this.state.bet.isPassed ?
                    <Text style={{height:20,  alignItems:"center"}}>status : actual</Text>
                    :
                    <Text style={{height:20, alignItems:"center"}}>status : finished</Text>
                  }
                </View>

                {this.state.bet.playersDetail.witness ?
                  <View style={{flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
                    <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                      <Text style={{fontWeight:"bold", color:"black", paddingRight:10}}>Judge</Text>
                      <Text style={{alignItems:"center"}}>{this.state.bet.playersDetail.witness.user.userName}</Text>
                    </View>
                    {this.state.bet.playersDetail.witness.user.imageProfil ?
                      <Image source={{uri:this.state.bet.playersDetail.witness.user.imageProfil}} style={{borderRadius:35, width:70, height:70,}}/>
                      :
                      <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70,}}/>
                    }
                  </View>
                  :null
                }
              </View>

              {(this.state.judingAllow && this.state.player1Exists && this.state.player2Exists) ?
                <View style={{flex:1,}}>
                  {!this.state.bet.isPassed ?
                    <TouchableOpacity onPress={this.toggleChooseWinner} style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2, marginTop:20 }}>
                      <Text style={{color:"white", fontWeight:"bold"}}>CHOOSE WINNER</Text>
                    </TouchableOpacity>
                    :
                    <Text>You cannot judge, the limit date is passed
                    </Text>
                  }
                </View>
                :null
              }

              <View style={{flex:4, flexDirection:"column", alignItems:"center", marginTop:30}}>
                <Text style={{fontWeight:"bold", color:"black"}}>Players</Text>
                <Text style={{width:50, height:50, position:"absolute", top:"45%", left:"45%", fontSize:30, color:"white", textShadowColor:'rgba(0,0,0,0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10, zIndex:100}}>VS
                </Text>
                {this.tabOfPlayer(false)}
              </View>
              {!this.state.judingAllow && this.state.bet.iAccepted!==true && this.state.bet.iAccepted!==false ?
                <View style={{flex:1,flexDirection:"row"}}>
                  {!this.state.bet.isPassed ?
                    <View>
                      {this.state.bet.current ?
                        <View>
                          <TouchableOpacity onPress={()=>this.accept(true)} style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                            <Text style={{color:"white", fontWeight:"bold"}}>ACCEPT</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>this.accept(false)} style={{backgroundColor:"rgba(219,110,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
                            <Text style={{color:"white", fontWeight:"bold"}}>REFUSE</Text>
                          </TouchableOpacity>
                        </View>
                        :
                        <Text>You cannot accept this bet, the winner is already choosen
                        </Text>
                      }
                    </View>
                    :
                    <Text>You cannot accept this bet, the limit date is passed
                    </Text>
                  }

                </View>
                :null
              }

            </View>
            :null
          }

          </ScrollView>
          {this.state.chooseWinner ?
            <View style={{position:"absolute", top:0, width:0,  width:"100%", height:"100%", backgroundColor:"rgba(255,255,255,0.95)", zIndex:101}}>
              <View style={{position:"absolute", top:50,  left:"10%", width:"80%", height:400, alignItems:"center", flexDirection:"column", zIndex:102}}>
                {this.tabOfPlayer(true)}
                <TouchableOpacity onPress={this.validateWinner} style={{backgroundColor:"rgba(110,219,124,1)", borderColor:"white", width:200, height:50,alignItems:"center", justifyContent:"center", borderRadius:2 }}>
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
      )}
    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const BetDetail = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(BetDetailComponent));
  export default BetDetail;
