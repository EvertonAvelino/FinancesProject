import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let firebaseConfig = {
	apiKey: "AIzaSyC2CItD2dHZybho2RBQItV8RergMDlsQdg",
	authDomain: "finances-38a6f.firebaseapp.com",
	databaseURL: "https://finances-38a6f-default-rtdb.firebaseio.com",
	projectId: "finances-38a6f",
	storageBucket: "finances-38a6f.appspot.com",
	messagingSenderId: "567705842647",
	appId: "1:567705842647:web:4a73a62e7768471b289192",
	measurementId: "G-PW1VQ4J06M"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
