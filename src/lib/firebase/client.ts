import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB-9iiLtLXNktnJ7Fv4Aw5at2ODI37eYp8",
  authDomain: "prevu-f35a3.firebaseapp.com",
  projectId: "prevu-f35a3",
  storageBucket: "prevu-f35a3.firebasestorage.app",
  messagingSenderId: "517443629435",
  appId: "1:517443629435:web:67fc19d702ed02b94ccdde",
  measurementId: "G-M19TJET6L2"
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
