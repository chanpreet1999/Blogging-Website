// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfrIrsuwjGetsxRPSJ9IhFT0lCXsr1MbI",
  authDomain: "blogging-website-72a8f.firebaseapp.com",
  projectId: "blogging-website-72a8f",
  storageBucket: "blogging-website-72a8f.appspot.com",
  messagingSenderId: "982431297298",
  appId: "1:982431297298:web:14f295dd89aebd73b64dcb"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();