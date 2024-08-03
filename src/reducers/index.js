import { combineReducers } from "redux";
import authReducer from './auth'
import currentUserReducer from './currentUser'
import typingReducer from "./typing";
import teamReducer from "./team";

export default combineReducers({
    authReducer, currentUserReducer, typingReducer, teamReducer
})