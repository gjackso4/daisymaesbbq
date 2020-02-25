import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBs-GmPOnw6eVOKnr9nP8wfYnNhXsar3Dg",
    authDomain: "daisymae-bbq.firebaseapp.com",
    databaseURL: "https://daisymae-bbq.firebaseio.com"
})

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// This is a default export
export default base;