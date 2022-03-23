import { db } from "../../firebaseConfig";
import { GET_NOTIFICATION } from "../types";

export const getNotification = (id: string) => (dispatch: any) => {
  const unsubscribe = db
    .collection("notification")
    // .orderBy("timestamp", "asc")
    .where("reciever", "==", id)
    .onSnapshot(
      (snapshot) => {
        if (snapshot.docs) {
          let data = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            data: doc.data(),
          }));

          dispatch({
            type: GET_NOTIFICATION,
            payload: data.sort((a, b) => {
              if (a.data.timestamp < b.data.timestamp) {
                return 1;
              } else if (a.data.timestamp > b.data.timestamp) {
                return -1;
              }
              return 0
            }),
          });
        }
      },
      (err: any) => {
        console.log("Error in getMessages: ", err);
      }
    );
  return unsubscribe;
};
