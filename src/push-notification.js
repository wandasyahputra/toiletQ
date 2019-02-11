import firebase from "firebase";

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: "805730725141"
  });
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    localStorage.setItem("pushToken", token);

    return token;
  } catch (error) {
    console.error(error);
  }
};
