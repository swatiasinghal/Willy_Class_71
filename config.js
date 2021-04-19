import firebase from 'firebase'
require('@firebase/firestore')

  var firebaseConfig = {
    apiKey: "AIzaSyBs01xocgmjJddVwryveoMB6Er2AIllQU8",
    authDomain: "willy-40cf6.firebaseapp.com",
    projectId: "willy-40cf6",
    storageBucket: "willy-40cf6.appspot.com",
    messagingSenderId: "421230695206",
    appId: "1:421230695206:web:286f382cc9a8a161cbe7e7"
  };
  // Initialize Firebase
  if(!firebase.apps.length)
{
firebase.initializeApp(firebaseConfig);

}
 
export default firebase.firestore();