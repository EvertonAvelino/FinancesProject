import React, { useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

import firebase from '../../service/firebaseConnection'
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import { Background, Container, Nome, Saldo, Title, List } from './styles'
import HistoricoList from '../../components/HistoricoList';
import { parseMoeda } from '../../components/Utilitarios';

export default function Home() {
	const [historico, setHistorico] = useState([]);
	const [saldo, setSaldo] = useState(0);

	const { user } = useContext(AuthContext);
	const uid = user && user.uid;

	useEffect(() => {
		async function loadList() {
			await firebase.database().ref('users').child(uid).on('value', (snapshot) => {
				setSaldo(snapshot.val().saldo);
			});
			await firebase.database().ref('historico')
				.child(uid)
				.orderByChild('date').equalTo(format(new Date, 'dd/MM/yy'))
				.limitToLast(10).on('value', (snapshot) => {
					setHistorico([]);

					snapshot.forEach((childItem) => {
						let list = {
							key: childItem.key,
							tipo: childItem.val().tipo,
							valor: childItem.val().valor
						}
						setHistorico(oldArray => [...oldArray, list].reverse())
					})
				})

		}
		loadList();
	}, [])

	return (
		<Background>
			<Header />
			<Container>
				<Nome>{user && user.nome}</Nome>
				<Saldo>R$ {parseMoeda(saldo)}</Saldo>
			</Container>
			<Title>Ultimas Movimentações</Title>
			<List
				showsVerticalScrollIndicator={false}
				data={historico}
				keyExtrator={item => item.key}
				renderItem={(item) => (<HistoricoList data={item} />)}
			/>
		</Background>
	);
}
