import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCg4q-7v4yWfFPAd3XvCvgXxI525aukHlc',
  authDomain: 'docs-clone-29c3e.firebaseapp.com',
  projectId: 'docs-clone-29c3e',
  storageBucket: 'docs-clone-29c3e.appspot.com',
  messagingSenderId: '998509856890',
  appId: '1:998509856890:web:9308eff8612ee9d68b93c3',
}
// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore()

export { db }
