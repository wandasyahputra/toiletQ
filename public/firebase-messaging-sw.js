// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize Firebase

var config = {
  apiKey: "AIzaSyCarl1eeWhKb9pk7D1ynLvf5TM3584fxIM",
  authDomain: "toiletq-d5d53.firebaseapp.com",
  databaseURL: "https://toiletq-d5d53.firebaseio.com",
  projectId: "toiletq-d5d53",
  storageBucket: "toiletq-d5d53.appspot.com",
  messagingSenderId: "365655056167"
};
firebase.initializeApp(config);

const messaging = firebase.messaging()
let type = null
messaging.setBackgroundMessageHandler(payload => {
  if(payload.data.refresh_data === 'iya'){
    return false
  }
  const notificationTitle = 'ToiletQ';
  const notificationOptions = {
    body: payload.data.body,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./')
  );
});
