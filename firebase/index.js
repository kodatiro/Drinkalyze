import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: ,
    authDomain: "drinkalyze.firebaseapp.com",
    databaseURL: "https://drinkalyze.firebaseio.com",
    projectId: "drinkalyze",
    storageBucket: "drinkalyze.appspot.com",
    messagingSenderId: "103706691789",
    appId: "1:103706691789:web:35793c35700158555d8184",
    measurementId: "G-9SC83WSVT4"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.database();

const storage = firebase.storage();

export { 
    auth, 
    db, 
    storage 
};
