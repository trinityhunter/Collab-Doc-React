import {
  createTeam as createTeamAPI,
  getAllTeams as getAllTeamsAPI,
  getTeamById as getTeamByIdAPI
} from '../api/index';

export const CREATE_TEAM_SUCCESS = 'CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = 'CREATE_TEAM_FAILURE';
export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = 'FETCH_TEAMS_FAILURE';
export const FETCH_TEAM_SUCCESS = 'FETCH_TEAM_SUCCESS';
export const FETCH_TEAM_FAILURE = 'FETCH_TEAM_FAILURE';

export const createTeam = (team) => async (dispatch) => {
  try {
    const response = await createTeamAPI(team);
    dispatch({ type: CREATE_TEAM_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CREATE_TEAM_FAILURE, payload: error.message });
  }
};

export const getAllTeams = () => async (dispatch) => {
  try {
    const response = await getAllTeamsAPI();
    dispatch({ type: FETCH_TEAMS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TEAMS_FAILURE, payload: error.message });
  }
};

export const getTeamById = (id) => async (dispatch) => {
  try {
    const response = await getTeamByIdAPI(id);
    dispatch({ type: FETCH_TEAM_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TEAM_FAILURE, payload: error.message });
  }
};
