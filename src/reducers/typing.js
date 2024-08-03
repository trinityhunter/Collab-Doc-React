import { USER_TYPING, USER_STOPPED_TYPING } from '../actions/typing';

const initialState = {};

const typingReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPING:
      const { userId, name } = action.payload;
      return { ...state, [userId]: name };
    case USER_STOPPED_TYPING:
      const { userId: stoppedUserId } = action.payload;
      const newState = { ...state };
      delete newState[stoppedUserId];
      return newState;
    default:
      return state;
  }
};

export default typingReducer;
