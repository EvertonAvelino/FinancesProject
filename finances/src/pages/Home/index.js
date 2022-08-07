import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { format, isBefore } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';

import firebase from '../../service/firebaseConnection'
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import { Background, Container, Nome, Saldo, Title, List, Area } from './styles'
import HistoricoList from '../../components/HistoricoList';
import { parseMoeda } from '../../components/Utilitarios';
import DatePicker from '../../components/DatePicker';

export default function Home() {
	const [historico, setHistorico] = useState([]);
	const [saldo, setSaldo] = useState(0);

	const { user } = useContext(AuthContext);
	const uid = user && user.uid;

	const [newDate, setNewDate] = useState(new Date());
	const [show, setShow] = useState(false);

	useEffect(() => {
		async function loadList() {
			await firebase.database().ref('users').child(uid).on('value', (snapshot) => {
				setSaldo(snapshot.val().saldo);
			});
			await firebase.database().ref('historico')
				.child(uid)
				.orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
				.limitToLast(10).on('value', (snapshot) => {
					setHistorico([]);

					snapshot.forEach((childItem) => {
						let list = {
							key: childItem.key,
							tipo: childItem.val().tipo,
							valor: childItem.val().valor,
							date: childItem.val().date
						}
						setHistorico(oldArray => [...oldArray, list].reverse())
					})
				})
		}
		loadList();
	}, [newDate])


	function handleDelete(data) {

		const [diaItem, mesItem, anoItem] = data.item.date.split('/')
		const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);

		// dataHoje pt-br
		const formatDataHoje = format(new Date, 'dd/MM/yyyy');
		const [diaHoje, mesHoje, anoHoje] = formatDataHoje.split('/')
		const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);

		//se data do registro já passou isBefore(new Date())
		if (isBefore(dateItem, dateHoje)) {
			alert("Registro antigo não pode ser excluido!");
			return;
		}
		Alert.alert(
			'Atenção!',
			`Deseja realmente excluir ${data.item.tipo} - Valor: ${data.item.valor}`,
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Excluir',
					onPress: () => handleDeleteSuccess(data)
				}
			]
		)
	}
	async function handleDeleteSuccess(data) {
		await firebase.database().ref('historico')
			.child(uid).child(data.item.key).remove()
			.then(async () => {
				let saldoAtual = saldo;
				data.item.tipo === 'despesa' ? saldoAtual += parseFloat(data.item.valor) : saldoAtual -= parseFloat(data.item.valor)
				await firebase.database().ref('users').child(uid)
					.child('saldo').set(saldoAtual)
			})
			.catch((error) =>
				console.log(error)
			);
	}
	function handleShowPicker() {
		setShow(true);
	}

	function handleClose() {
		setShow(false);
	}

	const onChange = (date) => {
		setShow(Platform.OS === 'ios');
		setNewDate(date);
		console.log(date);
	}
	return (
		<Background>
			<Header />
			<Container>
				<Nome>{user && user.nome}</Nome>
				<Saldo>R$ {parseMoeda(saldo)}</Saldo>
			</Container>
			<Area>
				<TouchableOpacity onPress={handleShowPicker}>
					<Icon name='calendar' color='#FFF' size={30} />
				</TouchableOpacity>
				<Title>Ultimas Movimentações</Title>
			</Area>
			<List
				showsVerticalScrollIndicator={false}
				data={historico}
				keyExtrator={item => item.key}
				renderItem={(item) => (<HistoricoList data={item} deleteItem={handleDelete} />)}
			/>
			{show && (
				<DatePicker
					onClose={handleClose}
					date={newDate}
					onChange={onChange}
				/>
			)}
		</Background>
	);
}
