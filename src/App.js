import React, { Component } from 'react'
import { askForPermissioToReceiveNotifications } from "./push-notification"
import Monitor from './Monitor'
import Login from './Login'
import './App.css';

class App extends Component {
  componetDidMount() {
    askForPermissioToReceiveNotifications();
  }
  render() {
    const login = localStorage.getItem('username')
    console.log(login)
    return (
    <div>
      {login !== null ? <Monitor/> : <Login/>}
    </div>
    );
  }
}

export default App;
