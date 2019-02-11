import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase'
import * as serviceWorker from './serviceWorker';

var config = {
  apiKey: "AIzaSyCarl1eeWhKb9pk7D1ynLvf5TM3584fxIM",
  authDomain: "toiletq-d5d53.firebaseapp.com",
  databaseURL: "https://toiletq-d5d53.firebaseio.com",
  projectId: "toiletq-d5d53",
  storageBucket: "toiletq-d5d53.appspot.com",
  messagingSenderId: "365655056167"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
