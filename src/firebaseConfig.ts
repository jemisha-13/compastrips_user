import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDWHVbOfF2R_I1TX8cP6C7oydgDPXF34Ew",
  authDomain: "compastrips.firebaseapp.com",
  projectId: "compastrips",
  storageBucket: "compastrips.appspot.com",
  messagingSenderId: "819037704776",
  appId: "1:819037704776:web:77591a295929bf7220be7d"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };
