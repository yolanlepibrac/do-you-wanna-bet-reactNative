import { combineReducers, createStore } from 'redux'
import accountReducer from '../Reducers/accountReducer';
import researchReducer from '../Reducers/researchReducer';
import helperReducer from '../Reducers/helperReducer';


// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer = combineReducers({
    account: accountReducer,
    research: researchReducer,
    helper: helperReducer,
})

const store = createStore(rootReducer)
export default store;
