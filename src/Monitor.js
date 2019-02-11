import React, { Component } from 'react';
import axios from 'axios'
import firebase from 'firebase'
import './App.css';

class Monitor extends Component {
  constructor() {
    super()
    this.state = {
      list: [],
      listantrian: [],
      openDetail: false,
      emptyToilet: 1,
      queue: false,
      queueNumber: 0,
      toiletid:'',
      openList: false

    }
  }
  componentDidMount() {
    this.syncData()
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging()
        messaging.onMessage((payload) => {
          window.navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
            console.log(payload)
            this.syncData()
          }
      )})
    }
  }

  syncData = () => {
    this.dismiss()
    const statusToilet = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/getstatustoilet.php`)
        res.status === 200 ? this.setState({ list: res.data.data, emptyToilet: res.data.emptytoilet }) : this.setState({ list: [] })
      } catch (e) {
      }
    }
    const queueList = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/getListAntrian.php`)
        res.status === 200 ? this.setState({ listantrian: res.data.data }) : this.setState({ listantrian: [] })
      } catch (e) {
      }
    }
    const getStatus = async() => {
      try {
        const username = localStorage.getItem('username')
        const res = await axios.get(`http://localhost/toiletq/getstatus.php?id=${username}`)
        if (res.status === 200) {
          if (res.data.data.ongoing) {
            this.setState({ ongoing: true, queue: false, toiletid: res.data.data.toiletid })
          } else {
            this.setState({ ongoing: false, queue: true, queueNumber: res.data.data.noantrian })
          }
        } else {
          this.setState({ ongoing: false, queue: false, queueNumber: 0 })
        }
      } catch (e) {
        this.setState({ ongoing: false, queue: false, queueNumber: 0 })
      }
    }
    getStatus()
    queueList()
    statusToilet()
  }

  dismiss = () => {
    this.setState({ openDetail: false, openList: false })
  }

  viewList = () => {
    this.setState({ openList: true})
  }
  
  requestQueue = () => {
    const username = localStorage.getItem('username')
    const reqQueue = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/requestantrian.php?id=${username}`)
        if (res.status === 200) {
          alert(`Mengantri sukses, silahkan tunggu ${res.data.data.noantrian} lagi`)
          this.syncData()
        }
      } catch (e) {
        alert('Anda sudah mengantri')
      }
    }
    reqQueue()
  }

  checkOut = () => {
    const username = localStorage.getItem('username')
    const { toiletid } = this.state
    const checkOutToilet = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/toilet.php?id=${username}&toilet=${toiletid}&method=keluar`)
        if (res.status === 200) {
          this.syncData()
          setTimeout(() => this.closeTheDoor(toiletid),15000)
        }
      } catch (e) {
        alert(e)
      }
    }
    checkOutToilet()
  }

  checkIn = () => {
    const username = localStorage.getItem('username')
    const { openDetail } = this.state
    const checkInToilet = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/toilet.php?id=${username}&toilet=${openDetail.id}&method=masuk`)
        if (res.status === 200) {
          this.syncData()
          setTimeout(() => this.closeTheDoor(openDetail.id),15000)
        }
      } catch (e) {
        alert('Anda sudah masuk')
      }
    }
    checkInToilet()
  }

  closeTheDoor = id => {
    const closingTheDoor = async() => {
      try {
        const res = await axios.get(`http://localhost/toiletq/handledoor.php?id=${id}`)
        res.status === 200 && console.log('door has been closed')
      } catch (e) {
      }
    }
    closingTheDoor()
  }

  handleClick = (content) => event => {
    const { listantrian, emptyToilet, queue, queueNumber } = this.state
    if (queue && (queueNumber <= emptyToilet)) {
      this.setState({openDetail: {
        id: content.id,
        name: content.toiletname
      }
    })
    }
    if (listantrian.length < emptyToilet) {
      this.setState({openDetail: {
        id: content.id,
        name: content.toiletname
      }
    })
    }
  }
  
  render() {
    const { 
      list,
      listantrian,
      openDetail,
      openList,
      emptyToilet,
      queue,
      ongoing,
      queueNumber
    } = this.state
    const username = localStorage.getItem('username')
    console.log(this.state)
    return (
      <div className="App">
        <div className="headers">
          <div>
            <img src="assets/img/group-3.png" alt=""/>
          </div>
          <div>
            <img src="assets/img/group-4.png" alt=""/>
          </div>
        </div>
        <div className="container">
          {
            list.map((content, key) => (
              content.status === 'kosong' ? (
                <div className="card" key={key.toString()} onClick={this.handleClick(content)}>
                  <img src='assets/img/toilet.jpg' alt='' />
                  <div>{content.toiletname}</div>
                </div>
              ) : (
                <div className="card" key={key.toString()}>
                  <div className="cardOverlay">
                    <img src='assets/img/toilet.jpg' alt='' />
                    <div>DIGUNAKAN</div>
                  </div>
                  <div>{content.toiletname}</div>
                </div>
              )
            ))
          }
        </div>
        <div className="footer">
          {
           ongoing && (
            <div className="description">
              Jika telah selesai, silahkan keluar dengan tombol berikut atau menekan tombol pada pintu
            </div>   
           )
          }
          { queue && (
            <div className="description">
            <div className="subDesc">
              Anda berada di antrian ke
            </div>
            <div className="antrian" onClick={this.viewList}>
             <span>
              {queueNumber}
             </span><span>Lihat</span>
            </div>
          </div>
          )}
          {
            // (
            //   <div className="description">
            //     Tersedia toilet kosong untuk anda. Silahkan gunakan toilet 
            //     {
            //       list.map((content, key) => (
            //         content.status === 'kosong' && <span key={key.toString()}> {content.toiletname}, </span>
            //       ))   
            //     }
            //   </div>
            //  )
          }
          {/* {listantrian.length > 0 && (
            <div className="description">
              Tersedia toilet kosong untuk anda. Silahkan gunakan toilet 
              {
                list.map((content) => (
                  content.status === 'kosong' && <span> {content.toiletname}, </span>
                ))   
              }
            </div>
          )} */}
          { openList && (
            <div>
              <div className="listAntrian">
              <div className="title"> List Antrian </div>
              {listantrian.map((content, key) => (
                <div className="listtoilet">
                  <div>
                    <img alt='' src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                  </div>
                  <div>
                    <div>Antrian {key+1} {content.hp === username && <span>you</span>}</div>
                    <div>{content.name}</div>
                  </div>
                </div>
              ))}
              </div>
              <div className="overlay" onClick={this.dismiss}/>
            </div>
            )
          } 
          <div>
            {
              ongoing && <button className="queue " onClick={this.checkOut}>Keluar</button>
            }
            {
              !ongoing && !queue && (emptyToilet > 0 && (listantrian.length < emptyToilet) ? 
              (<button className="queue disabled" onClick={this.requestQueue}>Antri</button>) : 
              (<button className="queue" onClick={this.requestQueue}>Antri</button>)) 
            }
          </div>
          {openDetail && (
            <div className="detail">
              <div className="content">
                <button className="queue" onClick={this.checkIn} >Gunakan dan Buka Pintu <br/> Toilet {openDetail.name}</button>
              </div>
              <span>Pintu akan tertutup 15 detik setelah dibuka, harap menekan tombol saat sudah didekat pintu toilet</span>
              <div className="overlay" onClick={this.dismiss}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Monitor;
