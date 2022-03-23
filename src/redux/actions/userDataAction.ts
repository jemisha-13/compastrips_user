import { ApiGet } from "../../helper/API/ApiData";
import {
  REMOVE_USER_DATA,
  USER_DATA,
  USER_DATA_ERR,
  USER_NOTIFICATION_TOGGLE,
} from "../types";

export const getUserData = () => (dispatch: any) => {
  ApiGet("user/GetUser")
    .then((res: any) => {
      dispatch({
        type: USER_DATA,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: REMOVE_USER_DATA
      })
      dispatch({
        type: USER_DATA_ERR,
        payload: error.message,
      });
    });
};

export const removeUserData = () => (dispatch: any) => {
  dispatch({
    type: REMOVE_USER_DATA,
  });
};

export const toggleNotification =
  (notification_state: boolean) => (dispatch: any) => {
    console.log("Staete", notification_state);

    dispatch({
      type: USER_NOTIFICATION_TOGGLE,
      payload: notification_state,
    });
  };
