import {
    CREATE_TEAM_SUCCESS,
    CREATE_TEAM_FAILURE,
    FETCH_TEAMS_SUCCESS,
    FETCH_TEAMS_FAILURE,
    FETCH_TEAM_SUCCESS,
    FETCH_TEAM_FAILURE
  } from '../actions/team';
  
  const initialState = {
    teams: [],
    team: null,
    error: null
  };
  
  const teamReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_TEAM_SUCCESS:
        return {
          ...state,
          teams: [...state.teams, action.payload]
        };
      case CREATE_TEAM_FAILURE:
        return {
          ...state,
          error: action.payload
        };
      case FETCH_TEAMS_SUCCESS:
        return {
          ...state,
          teams: action.payload
        };
      case FETCH_TEAMS_FAILURE:
        return {
          ...state,
          error: action.payload
        };
      case FETCH_TEAM_SUCCESS:
        return {
          ...state,
          team: action.payload
        };
      case FETCH_TEAM_FAILURE:
        return {
          ...state,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default teamReducer;
  