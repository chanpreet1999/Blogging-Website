// Your web app's Firebase configuration
const firebaseConfig = {
  // your firebase config
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

const logoutUser = () => {
  auth.signOut();
  location.reload();
}