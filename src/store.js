// import React from "react";
import { createStore, combineReducers, compose } from "redux";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import "firebase/firestore";
import firebase from "firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyDImzoWi4oJzbGuemda30CG7GKcj0eIbEo",
  authDomain: "reactclientpanel-8627b.firebaseapp.com",
  databaseURL: "https://reactclientpanel-8627b.firebaseio.com",
  projectId: "reactclientpanel-8627b",
  storageBucket: "reactclientpanel-8627b.appspot.com",
  messagingSenderId: "153501565789"
};

//rr-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};

//init fb instance
firebase.initializeApp(firebaseConfig);
//init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

if (localStorage.getItem("settings") == null) {
  const defaultSettings = {
    disableBalanceOnAdd: false,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //set to LS

  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
