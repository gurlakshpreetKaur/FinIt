import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "@firebase/firestore";
import { getAuth, Auth } from "@firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDaNNX_ViKwEOQQUwK5MTqvvv2vNRn4yII",
    authDomain: "finit-28be1.firebaseapp.com",
    projectId: "finit-28be1",
    storageBucket: "finit-28be1.appspot.com",
    messagingSenderId: "521970270192",
    appId: "1:521970270192:web:cb3aa44d72fd58331da735"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { db, auth };