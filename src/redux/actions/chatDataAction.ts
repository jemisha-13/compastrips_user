import { db } from "../../firebaseConfig";
import {
  CHAT_DATA,
  CHAT_ID,
  CHAT_STATE,
  MESSAGE_STATE,
  SET_OTHER_USER,
} from "../types";

export const getChatData = (id: string) => (dispatch: any) => {
  let unsubscribe = db
    .collection("users")
    .where("ids", "array-contains", id)
    .onSnapshot((snapshot: { docs: any[] }) => {
      if (snapshot.docs) {
        let data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .sort((a, b) => {
            if (a.data.timestamp < b.data.timestamp) {
              return 1;
            } else if (a.data.timestamp > b.data.timestamp) {
              return -1;
            }
            return 0;
          });

        let count: number;
        count = data
          .map((x) => {
            const key = x.data.ids.find((y: string) => y !== id);
            return x.data[`${key}_count`];
          })
          .reduce((ans, val) => ans + val, 0);

        dispatch({
          type: CHAT_DATA,
          payload: { data, count },
        });
      } else {
        dispatch({
          type: CHAT_DATA,
          payload: [],
        });
      }
    });
  return unsubscribe;
};

export const setMessageState = (value: boolean) => (dispatch: any) => {
  dispatch({
    type: MESSAGE_STATE,
    payload: value,
  });
};

export const setChatState = (value: boolean) => (dispatch: any) => {
  dispatch({
    type: CHAT_STATE,
    payload: value,
  });
};

export const setOtherUserData = (value: any) => (dispatch: any) => {
  dispatch({
    type: SET_OTHER_USER,
    payload: value,
  });
};

export const setChatId = (id: string) => (dispatch: any) => {
  dispatch({
    type: CHAT_ID,
    payload: id,
  });
};
