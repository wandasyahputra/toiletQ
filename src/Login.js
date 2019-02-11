import React, { Component } from 'react';
import axios from 'axios'
import firebase from 'firebase'
import './App.css';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      tfcm: '',
      username: '',
      password: ''
    }
  }
  componentDidMount() {
    // const sending = async() => {
    //   try {
    //     const res = await axios.get(`http://localhost/toiletq/getstatustoilet.php`)
    //     res.status === 200 ? this.setState({ list: res.data.data }) : this.setState({ list: [] })
    //   } catch (e) {
    //   }
    // }
    // const get = async() => {
    //   try {
    //     const res = await axios.get(`http://localhost/toiletq/getListAntrian.php`)
    //     res.status === 200 ? this.setState({ listantrian: res.data.data }) : this.setState({ listantrian: [] })
    //   } catch (e) {
    //   }
    // }
    // get()
    // sending()
  }

  doLogin = () => {
    const { username, password } = this.state
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
        messaging.requestPermission()
        .then(() => {
          return messaging.getToken()
        })
        .then((token) => {
          this.setState({tfcm: token})
          console.log(token)
          const sending = async() => {
            try {
              const res = await axios.get(`http://localhost/toiletq/login.php?phone=${username}&password=${password}&tfcm=${token}`)
              if (res.status === 200) {
                localStorage.setItem('username', username)
                localStorage.setItem('fcm', token)
                window.location.reload()
              }
            } catch (e) {
              console.log('gagal login')
            }
          }
          sending()
        })
        .catch(() => {
          const sending = async() => {
            try {
              const res = await axios.get(`http://localhost/toiletq/login.php?phone=${username}&password=${password}&tfcm=`)
              if (res.status === 200) {
                localStorage.setItem('username', username)
                window.location.reload()
              }
            } catch (e) {
              console.log('gagal login')
            }
          }
          sending()
        })
    } else {
      const sending = async() => {
        try {
          const res = await axios.get(`http://localhost/toiletq/login.php?phone=${username}&password=${password}&tfcm=`)
          if (res.status === 200) {
            localStorage.setItem('username', username)
            window.location.reload()
          }
        } catch (e) {
          console.log('gagal login')
        }
      }
      sending()
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  
  render() {
    const { username, password } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src='assets/img/group-3.jpg' alt='' />
          <br/>
          <input type="text" name="username" placeholder="Phone" value={username} onChange={this.handleChange} />
          <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange} />
          <button className="queue login" onClick={this.doLogin}>Login</button>
        </header>
      </div>
    );
  }
}

export default Login;
