import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';
import API from '../Utils/API';
import Utils from '../Utils/Utils';


function mapDispatchToProps(dispatch) {
  return {
  };
};


class BetItemComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      players1 : [],
      players2 : [],
      witness : [],
      imTheWitness : false,
      iWon : false,
      iAccepted:undefined,
      isPassed: false,
     }
  }

  getFriendsWithTabId = (tabOfFriendID, key) => {
        var newTabOfFriendID = [];
        var copiedTabOfFriendID = [];
        Object.assign(copiedTabOfFriendID, tabOfFriendID);


        for (var i = 0; i < copiedTabOfFriendID.length; i++) {
          if(copiedTabOfFriendID[i]===undefined ||copiedTabOfFriendID[i]===null){
            copiedTabOfFriendID.splice(i, 1);
            break;
          }
          if(typeof(copiedTabOfFriendID[i])==="string"){
            copiedTabOfFriendID[i] = {id:copiedTabOfFriendID[i], accepted:undefined}
          }
        //  console.log(copiedTabOfFriendID[i])
          if(copiedTabOfFriendID[i].id === this.props.accountState.account.id){
            newTabOfFriendID.push({user:this.props.accountState.account, accepted:copiedTabOfFriendID[i].accepted});
            this.setState({iAccepted:copiedTabOfFriendID[i].accepted})
            if(copiedTabOfFriendID[i].id === this.props.accountState.account.id){
              if(key === "witness"){
                this.setState({imTheWitness : true})
              }
              if(key === "players1" && this.props.bet.win === true){
                  this.setState({iWon:true})
              }
              if(key === "players2" && this.props.bet.win === false){
                  this.setState({iWon:true})
              }
            }

            copiedTabOfFriendID.splice(i, 1)

          }else{

            for (var j = 0; j < this.props.accountState.friends.length; j++) {
              if(copiedTabOfFriendID[i] !== undefined && this.props.accountState.friends[j] !== undefined){
                if(this.props.accountState.friends[j].id === copiedTabOfFriendID[i].id){
                  newTabOfFriendID.push({user:this.props.accountState.friends[j],accepted:copiedTabOfFriendID[i].accepted})
                  copiedTabOfFriendID.splice(i, 1)
                }
              }
              //console.log(this.props.accountState.friends[j].id)

            }
          }
        }

        if(copiedTabOfFriendID.length>0){
          API.getUsersDataByID(copiedTabOfFriendID.map((friendObject)=>(friendObject.id))).then((data)=>{
            var tabWithAccepted = []
            for (var i = 0; i < data.data.usersData.length; i++) {
              if(copiedTabOfFriendID[i] !== undefined){
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:copiedTabOfFriendID[i].accepted}
              }else{
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:undefined}
              }
            }
            var newFullTab = newTabOfFriendID.concat(tabWithAccepted);
            this.setState({[key]: newFullTab});
          });
        }else{
            this.setState({[key]: newTabOfFriendID});
        }

  }

  componentDidMount = () => {


    let bet  = this.props.navigation.getParam('bet', this.props.bet)
    this.setState({ bet : bet});
    this.getFriendsWithTabId(this.props.bet.players1, "players1")
    this.getFriendsWithTabId(this.props.bet.players2, "players2")
    this.getFriendsWithTabId([this.props.bet.witness], "witness")

    let betDate = bet.expiration
    let todayDate = Utils.dateToString(new Date())
    var isPassed = this.checkIfDateIsPassed(betDate, todayDate)
    if(this.checkIfDateIsPassed(betDate, todayDate)){
      this.setState({isPassed : true})
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
        this.getFriendsWithTabId(this.props.bet.players1, "players1")
        this.getFriendsWithTabId(this.props.bet.players2, "players2")
        this.getFriendsWithTabId([this.props.bet.witness], "witness")
        this.setState({ bet : this.props.navigation.getParam('bet', this.props.bet)});
    }
  }

  checkIfDateIsPassed = (betDate, todayDate) => {
     let isPassed = false
     if(betDate !== "never" && betDate !== undefined){
       console.log(betDate)
       console.log(todayDate)
       let betDateYear = parseInt(betDate.substr(betDate.length-4, betDate.length-1))
       let todayDateYear = parseInt(todayDate.substr(todayDate.length-4, todayDate.length-1))
       console.log(betDateYear)
       console.log(todayDateYear)
       if(todayDateYear>betDateYear){
         isPassed = true
       }else if (todayDateYear === betDateYear){
         let betDateMonth = parseInt(betDate.substr(betDate.length-7, betDate.length-3))
         let todayDateMonth = parseInt(todayDate.substr(todayDate.length-7, todayDate.length-3))
         console.log(betDateMonth)
         console.log(todayDateMonth)
         if(todayDateMonth>betDateMonth){
           isPassed = true
         }else if(todayDateMonth===betDateMonth){
           let betDateDay = parseInt(betDate.substr(betDate.length-10, betDate.length-6))
           let todayDateDay = parseInt(todayDate.substr(todayDate.length-10, todayDate.length-6))
           console.log(betDateDay)
           console.log(todayDateDay)
           if(todayDateDay>betDateDay){
             isPassed = true
           }
         }
       }
     }
     return isPassed
   }




  onClick = (context) => {
    let betWithPlayersInfo={};
    const returnedTarget = Object.assign(betWithPlayersInfo, this.state.bet);
    betWithPlayersInfo.playersDetail = {}
    betWithPlayersInfo.playersDetail.players1 = this.state.players1
    betWithPlayersInfo.playersDetail.players2 = this.state.players2
    betWithPlayersInfo.playersDetail.witness = this.state.witness[0]
    betWithPlayersInfo.iAccepted = this.state.iAccepted
    betWithPlayersInfo.isPassed = this.state.isPassed
    this.props.getBetDetail(betWithPlayersInfo)
  }

  displayWinOrLoose = () => {
    if(this.state.iWon){
      return(
          <Image style={{position:"absolute", width:30, height:30, top:30, right:20,}} source={require('../assets/images/won.png')}/>
      )
    }else{
      return(
          <Image style={{position:"absolute", width:30, height:30, top:30, right:20,}} source={require('../assets/images/lost.png')}/>
      )
    }
  }

  displayStatus = () => {
    if(this.state.iAccepted===false){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"red"}}>REFUSED</Text>

    }else if(this.state.iAccepted!==true && this.state.iAccepted!==false){
      if(this.state.isPassed || !this.state.bet.current){
        return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"grey",}}>CLOSED</Text>
      }else{
        return <Text style={{position:"absolute",  height:30, top:30, right:70,  fontWeight:"bold"}}>NEW</Text>
      }
    }else if(this.state.iAccepted===true){
      if(!this.state.bet.current){
        if(this.state.iWon){
          return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"green"}}>WON</Text>

        }else{
          return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"red"}}>LOST</Text>

        }
      }else{
        if(this.state.isPassed){
          return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"grey",}}>CLOSED</Text>
        }
      }
    }
    /*
    if(this.state.iAccepted!==true && this.state.iAccepted!==false && !this.state.isPassed && this.state.bet.current){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,  fontWeight:"bold"}}>NEW</Text>

    }else if(this.state.iAccepted!==true && this.state.iAccepted!==false && (this.state.isPassed || !this.state.bet.current)){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"grey",}}>CLOSED</Text>

    }else if(this.state.iAccepted===true && (this.state.isPassed || !this.state.bet.current)){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"red"}}>REFUSED</Text>

    }else if(this.state.iAccepted===false){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"red"}}>REFUSED</Text>

    }else if(!this.state.bet.current && this.state.iAccepted===true && this.state.iWon){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"green"}}>WON</Text>

    }else if(!this.state.bet.current && this.state.iAccepted===true){
      return <Text style={{position:"absolute",  height:30, top:30, right:70,color:"red"}}>LOST</Text>

    }
    */

  }

  render(){
      if(!((this.state.players1.length>0) && (this.state.players2.length>0) && (this.state.witness.length>0))){
        return(
          <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"center", height:100, flex:1}}>
            <ActivityIndicator color={"green"} size={"large"}>
            </ActivityIndicator>
          </View>
        )
      }else{
        return(
          <TouchableOpacity onPress={this.onClick} style={{flexDirection:"row",  alignItems:"flex-start", height:100, flex:1, alignItems:"center", backgroundColor:this.state.iAccepted===false?"rgba(200,0,0,0.1)":this.state.bet.current&&!this.state.isPassed?"rgba(200,200,200,0)":"rgba(200,200,200,0.3)"}}>
            <View style={{width:100, height:100}}>
              {this.state.players1.length>0 ?
                  <View style={{width:100, height:100, position:"absolute", top:5, left:5}}>
                    {this.state.players1[0].user.imageProfil ?
                      <Image source={{uri:this.state.players1[0].user.imageProfil}} style={{borderRadius:35, width:70, height:70,}}/>
                      :
                      <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70,}}/>
                    }
                  </View>
                  :
                  <View style={{width:70, height:70, backgroundColor:"red", position:"absolute", top:5, left:5}}>
                  </View>
              }
              {this.state.players2.length>0 ?
                <View style={{width:100, height:100, position:"absolute", top:25, left:25}}>
                  {this.state.players1[0].user.imageProfil ?
                    <Image source={{uri:this.state.players2[0].user.imageProfil}} style={{borderRadius:35, width:70, height:70}}/>
                    :
                    <Image source={require('../assets/images/connectBig.png')} style={{borderRadius:35, width:70, height:70}}/>
                  }
                </View>
                :
                <View style={{width:70, height:70, backgroundColor:"red", position:"absolute", top:25, left:25}}>
                </View>
              }
            </View>
            <View style={{flex:1, flexDirection:"column", alignItems:"flex-start",justifyContent:"center"}}>
              <View style={{}}>
                <Text style={{fontSize:15, color:this.state.bet.current&&!this.state.isPassed&&this.state.iAccepted!==false?"black":"rgba(187,187,187,1)"}}>{this.state.bet.title}</Text>
              </View>
              <View>
                <Text style={{fontSize:13, color:this.state.bet.current&&!this.state.isPassed&&this.state.iAccepted!==false?"black":"rgba(187,187,187,1)"}}>{this.state.bet.issue}</Text>
              </View>
              <View>
                <Text style={{fontSize:10, color:this.state.bet.current&&!this.state.isPassed&&this.state.iAccepted!==false?"black":"rgba(187,187,187,1)"}}>{"create : "+this.state.bet.creation}</Text>
              </View>
              <View>
                <Text style={{fontSize:10, color:this.state.bet.current&&!this.state.isPassed&&this.state.iAccepted!==false?"black":"rgba(187,187,187,1)"}}>{"expiration : "+this.state.bet.expiration}</Text>
              </View>
            </View>

            {!this.state.imTheWitness?this.displayStatus():null}
            {!this.state.bet.current && this.state.iAccepted===true && !this.state.imTheWitness ?
              this.displayWinOrLoose()
              :
              <Image style={{position:"absolute", width:30, height:30, top:25, right:20,}} source={require('../assets/images/right.png')}/>
            }
          </TouchableOpacity>
        )
      }

    }
  }

  const mapStateToProps = (state) => {
    return {
      accountState:state.account.accountStateRedux,
    }
  }

  const BetItem = connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(BetItemComponent));
  export default BetItem;
