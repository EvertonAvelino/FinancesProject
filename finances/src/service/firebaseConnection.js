import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let firebaseConfig = {
	apiKey: "AIzaSyBcA9mb1y5IGJ9axndXKlNAbg3TIYoLAtE",
	authDomain: "finances-66ebe.firebaseapp.com",
	databaseURL: "https://finances-66ebe-default-rtdb.firebaseio.com",
	projectId: "finances-66ebe",
	storageBucket: "finances-66ebe.appspot.com",
	messagingSenderId: "834680903565",
	appId: "1:834680903565:web:cacf12e3582a0b539c0fc4",
	measurementId: "G-H2PV9QNTQS"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
