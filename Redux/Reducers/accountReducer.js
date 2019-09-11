import { SET_ACCOUNTSTATE, CONNECT, SET_NEW_BET, SET_BET_SELECTED, SET_BET_INACTIVE, SET_WINNER, SET_FRIENDSSTATE, GET_USERBETS, GET_USERFRIENDS, RESET_ACCOUNTSTATE, GET_USERWITNESSOF, UPDATE_WITNESSOF  } from "../Constants/action-types";

const initialState = {
  connectedRedux:false,

  accountStateRedux:{
    currentBet: {
    id : "78337",
    title:"je gagne tous mes paris",
    issue:"1 kebab",
    expiration:"10/12/2015",
    creation:"10/12/2015",
    players1:["515313"],
    players2:["65161", "51651"],
    win: true,
    current:false,
    witness:"5646846"
    },
    account:{
      id:2000,
      userName:"yolan",
      email:"",
      imageProfile:"",
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],
      won:3,
    },
    friends:[

      {userName : "Hippo", numnberOfBet:10, id:82574752, won:2, judgeNote:4.5,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "gab", numnberOfBet:10, id:53554, won:2, judgeNote:4.2,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "bertrand", numnberOfBet:10, id:105785253, won:2, judgeNote:3.5,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "Mickael", numnberOfBet:10, id:6546, won:2, judgeNote:3,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Solar", id:102553, won:2, judgeNote:2.1,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Solard", id:4444444, won:2, judgeNote:1.1,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC ListOfItemsslar", numnberOfBet:10, id:33333, won:2, judgeNote:0.7,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC solidlar", numnberOfBet:10, id:444444, won:2, judgeNote:0,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Sodlar", numnberOfBet:10, id:10522777753, won:2, judgeNote:-1,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Sodlar", numnberOfBet:10, id:1022588888872753, won:2,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:1025555555753, won:2,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:172720253, won:2,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:102667666553, won:2,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:275571272,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:1025718852523,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:1801253,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:10288853,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
      {userName : "MC Szeolar", numnberOfBet:10, id:88,
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],},
    ],
    witnessOf:[
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
    ],
    bets:[

      ]
    }
}


function accountReducer(state = initialState, action) {
  let nextState
  let newBets
  let newAccountState

  switch (action.type) {

    case CONNECT:
          nextState = {
            ...state,
            connectedRedux: action.connected
          }
        return nextState || state
    break;

    case SET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.account = action.account;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case RESET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.bets = [];
          newAccountState.friends = [];
          newAccountState.account = {};
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
          //console.log(action.account)
        return nextState || state
    break;

    case GET_USERFRIENDS:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.tabOfFriends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_FRIENDSSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.friends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_NEW_BET:
          newAccountState = state.accountStateRedux
          newAccountState.bets.push(action.newBet)
          nextState = {
            ...state,
            accountState: newAccountState
          }
          console.log(nextState)
        return nextState || state
    break;

    case GET_USERBETS:
          newAccountState = state.accountStateRedux
          newAccountState.bets = action.tabOfBets
          nextState = {
            ...state,
            accountState: newAccountState
          }
          //console.log(action.tabOfBets)
        return nextState || state
    break;

    case GET_USERWITNESSOF:
        newAccountState = state.accountStateRedux
        newAccountState.witnessOf = action.tabOfWitnessOf
        nextState = {
          ...state,
          accountState: newAccountState
        }
        //console.log(action.tabOfWitnessOf)
      return nextState || state
    break;


    case SET_BET_SELECTED:
          newAccountState = state.accountStateRedux
          newAccountState.currentBet = action.bet
          nextState = {
            ...state,
            currentBet: newAccountState
          }
        return nextState || state
    break;

    case SET_BET_INACTIVE:
          newAccountState = state.accountStateRedux
          newAccountState.bets[action.betID].statusCurrent = false;
          nextState = {
            ...state,
            myBets: newBets
          }
        return nextState || state
    break;

    case SET_WINNER:
          newAccountState = state.accountStateRedux
          newAccountState.bets[action.betID].winners.push({id:action.accountID});
          nextState = {
            ...state,
            accountStateRedux: newAccountState
          }
        return nextState || state
    break;

    case UPDATE_WITNESSOF:
    newAccountState = state.accountStateRedux
    for (var i = 0; i < newAccountState.witnessOf.length; i++) {
      if(newAccountState.witnessOf[i].id === action.bet.id){
        newAccountState.witnessOf[i] = action.bet
      }
    }
    nextState = {
      ...state,
      accountStateRedux: newAccountState
    }
    //console.log(newAccountState)
  return nextState || state
break;

    default:;

  }
  return state;
}
export default accountReducer;
