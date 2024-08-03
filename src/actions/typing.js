export const USER_TYPING = 'USER_TYPING';
export const USER_STOPPED_TYPING = 'USER_STOPPED_TYPING';

export const userTyping = (userId, name) => ({
  type: USER_TYPING,
  payload: { userId, name },
});

export const userStoppedTyping = (userId) => ({
  type: USER_STOPPED_TYPING,
  payload: { userId },
});
