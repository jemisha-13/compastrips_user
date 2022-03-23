import {
  CHAT_DATA,
  CHAT_ID,
  CHAT_STATE,
  MESSAGE_STATE,
  SET_OTHER_USER,
} from "../types";

const initialState = {
  chatData: [],
  count: 0,
  chatDataErr: null,
  message_open: false,
  chat_open: false,
  otherUser: {},
  id: "",
};

export const chatDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHAT_DATA:
      return {
        ...state,
        chatData: action.payload.data,
        count: action.payload.count,
      };
    case MESSAGE_STATE:
      return {
        ...state,
        message_open: action.payload,
      };
    case CHAT_STATE:
      return {
        ...state,
        chat_open: action.payload,
      };
    case SET_OTHER_USER:
      return {
        ...state,
        otherUser: action.payload,
      };
    case CHAT_ID:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
};
