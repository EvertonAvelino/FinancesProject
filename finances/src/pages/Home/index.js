import React, { useContext, useState } from 'react';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import { Background, Container, Nome, Saldo, Title, List } from './styles'
import HistoricoList from '../../components/HistoricoList';

export default function Home() {
	const [historico, setHistorico] = useState([
		{ key: '1', tipo: 'receita', valor: 1200 },
		{ key: '2', tipo: 'despesa', valor: 200 },
		{ key: '3', tipo: 'despesa', valor: 89.90 },
		{ key: '4', tipo: 'receita', valor: 500 },
		{ key: '5', tipo: 'despesa', valor: 90.99 },
		{ key: '6', tipo: 'despesa', valor: 150 },
	])

	const { user } = useContext(AuthContext);

	return (
		<Background>
			<Header />
			<Container>
				<Nome>{user && user.nome}</Nome>
				<Saldo>R$12000,00</Saldo>
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
