// 🔥 MF Voice Party - Firebase Core Config

const firebaseConfig = {
  apiKey: "AIzaSyBUAR6JQU1bZzj2cEkzwvtIbPuRhpwf4Ds",
  authDomain: "global-voice-chat-app.firebaseapp.com",
  databaseURL: "https://global-voice-chat-app-default-rtdb.firebaseio.com/",
  projectId: "global-voice-chat-app",
  storageBucket: "global-voice-chat-app.appspot.com",
  messagingSenderId: "876616774880",
  appId: "1:876616774880:web:b0f7b1a9140df57307cc85"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global references
const auth = firebase.auth();
const db = firebase.database();
