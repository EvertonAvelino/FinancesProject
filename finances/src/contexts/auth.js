import React, { useState, createContext, useEffect } from 'react';
import firebase from '../service/firebaseConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingAuth, setLoadingAuth] = useState(false);


	useEffect(() => {
		async function loadStorage() {
			const userStorage = await AsyncStorage.getItem('Auth_user');

			if (storageUser) {
				setUser(JSON.parse(userStorage))
				setLoading(false)
			}
			setLoading(false)
		}

		loadStorage();
	}, []);

	// logar usuario
	async function signIn(email, password) {
		setLoadingAuth(true);
		await firebase.auth().signInWithEmailAndPassword(email, password)
			.then(async (value) => {
				let uid = value.user.uid
				await firebase.database().ref('users').child(uid).once('value')
					.then((snapshot) => {
						let data = {
							uid: uid,
							nome: snapshot.val().nome,
							email: value.user.email
						}
						setUser(data);
						storageUser(data);
						setLoadingAuth(false);
					})
			})
			.catch((error) => {
				console.log(error.code)

				if (error.code === 'auth/invalid-email') {
					alert('Confira seu email!');
				}
				if (error.code === 'auth/wrong-password') {
					alert('Confira sua senha!');
				}

				setLoadingAuth(false);
			})
	}

	//Cadastrar usuario
	async function signUp(email, password, nome) {
		setLoadingAuth(true);
		await firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(async (value) => {
				let uid = value.user.uid;
				await firebase.database().ref('users').child(uid).set({
					saldo: 0,
					nome: nome
				})
					.then(() => {
						let data = {
							uid: uid,
							nome: nome,
							email: value.user.email,
						};
						setUser(data);
						storageUser(data);
						setLoadingAuth(false);
					})
			})
			.catch((error) => {
				alert(error.code);
				setLoadingAuth(false);
			})
	}
	//salva dados de usuario no asyncStorage
	async function storageUser(data) {
		await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
	}

	async function signOut() {
		await firebase.auth().signOut();
		await AsyncStorage.clear()
			.then(() => {
				setUser(null)
			})
	}

	return (
		<AuthContext.Provider value={{ signed: !!user, user, loading, signUp, signIn, signOut, loadingAuth }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
