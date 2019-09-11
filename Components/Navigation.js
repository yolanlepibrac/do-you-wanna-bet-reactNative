
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import BetContainer1 from './BetContainer1'
import BetContainer2 from './BetContainer2'
import ChooseJudge from './ChooseJudge'
import ChooseFriends from './ChooseFriends'
import BetMadeContainer from './BetMadeContainer'
import BetDetail from './BetDetail'
import BetJudgeContainer from './BetJudgeContainer'
import AccountContainer from './AccountContainer'
import NoAccount from './NoAccount';
import FriendsContainer from './FriendsContainer'
import FriendDetail from './FriendDetail'

const BetContainer2Navigation = createStackNavigator({
  BetContainer2: {
    screen: BetContainer2,
    navigationOptions: {
      header:null,
      headerMode : "none",
    },
  },
  ChooseJudge: {
    screen: ChooseJudge,
    navigationOptions: {
      header:null,
    },
  },
  ChooseFriends: {
    screen: ChooseFriends,
    navigationOptions: {
      header:null,
    },
  },
});

const BetNavigation = createStackNavigator({
  BetContainer1: {
    screen: BetContainer1,
    navigationOptions: {
      header:null,
    },
  },
  BetContainer2Navigation: {
    screen: BetContainer2Navigation,
    navigationOptions: {
      header:null,
      headerMode : "none",
    },
  },

});


const BetDetailNavigation = createStackNavigator({
  BetMadeContainer: {
    screen: BetMadeContainer,
    navigationOptions: {
      header:null,
    },
  },
  BetDetail: {
    screen: BetDetail,
    navigationOptions: {
      title:"Back to bets",
      height:50,
      headerMode : "none",
    },
  },
});

const FriendDetailNavigation = createStackNavigator({
  FriendsContainer: {
    screen: FriendsContainer,
    navigationOptions: {
      header:null,
    },
  },
  FriendDetail: {
    screen: FriendDetail,
    navigationOptions: {
      title:"Back to friends",
      height:10,
      headerMode : "none",
    },
  },
});

const BetJudgeNavigation = createStackNavigator({
  BetJudgeContainer: {
    screen: BetJudgeContainer,
    navigationOptions: {
      header:null,
    },
  },
  BetDetail: {
    screen: BetDetail,
    navigationOptions: {
      title:"Back to judge",
      height:50,
      headerMode : "none",
    },
  },
});




const TopNavigation = createMaterialTopTabNavigator(
  {
    BetNavigation: {
      screen: BetNavigation,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/betOnSelect.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/betOn.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    BetDetailNavigation: {
      screen: BetDetailNavigation,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/myBetsSelect.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/myBets.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    BetJudgeNavigation: {
      screen: BetJudgeNavigation,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/judgeSelect.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/judge.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    FriendDetailNavigation: {
      screen: FriendDetailNavigation,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/friendsSelect.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/friends.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
    AccountContainer: {
      screen: props => <AccountContainer {...props}  logout={() => this.props.logout} name={props}/>,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          if(focused){
            return <Image source={require('../assets/images/settingsSelect.png')} style={{width: 30,height: 30}}/>
          }else{
            return <Image source={require('../assets/images/settings.png')} style={{width: 30,height: 30}}/>
          }
        }
      },
    },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: 'rgba(200,200,200,1)',
      inactiveTintColor: 'rgba(100,100,100,1)',
      style: {
        backgroundColor: 'rgba(240,240,240,1)',
        paddingBottom:10,
      },
      labelStyle: {
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#000000',
        borderBottomWidth: 0,
      },
    },
  }
);

//props => <TopNavigation {...props} logout={this.props.logout}/>

const Navigation = createStackNavigator({
  NoAccount: {
    screen: NoAccount,
    navigationOptions: ({navigation})=> ({
      props:navigation,
      headerStyle: {
        height:0,
        backgroundColor: '#003689',
      },
      headerTintColor: '#FFFFFF',
    }),
  },
  TopNavigation: {
    screen: TopNavigation,
    navigationOptions: ({navigation})=> ({
      props:navigation,
      headerMode : "none",
      headerStyle: {
        height:0,
        backgroundColor: '#003689',
      },
      headerTintColor: '#FFFFFF',
    }),
  },



});



export default createAppContainer(Navigation)
