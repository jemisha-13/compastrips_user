import {
  REMOVE_USER_DATA,
  USER_DATA,
  USER_DATA_ERR,
  USER_NOTIFICATION_TOGGLE,
} from "../types";

const initialState = {
  userData: {
    notification: false,
  },
  userDataErr: null,
};

export const userDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_DATA:
      return {
        ...state,
        userData: action.payload,
        userDataErr: null,
      };

    case USER_DATA_ERR:
      return {
        ...state,
        userDataErr: action.payload,
        userData: null,
      };

    case REMOVE_USER_DATA:
      return {
        ...state,
        userDataErr: null,
        userData: null,
      };

    case USER_NOTIFICATION_TOGGLE:
      return {
        ...state,
        userData: {
          ...state.userData,
          notification: action.payload,
        },
      };

    default:
      return state;
  }
};
