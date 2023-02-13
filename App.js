// Importações
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { initializeApp } from "firebase/app";
import { Button, DataTable, Text, TextInput } from 'react-native-paper';
import { addDoc, collection, getFirestore, setDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; 

// Firebase
const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Base de dados
const baseDados = getFirestore(app);

// Componente
export default function App() {

  // State
  const [nome, setNome]   = useState('');
  const [idade, setIdade] = useState('');
  const [vetor, setVetor] = useState([]);

  useEffect(() => {
    setVetor([]);
    obterClientes();
  }, [])

  // Obter clientes
  const obterClientes = async() => {
    const retorno = await getDocs(collection(baseDados, 'clientes'));

    retorno.forEach((obj) => {
      let cliente = obj.data();
      cliente.codigo = obj.id;
      setVetor(vetor => [...vetor, cliente]);
    })
  }

  // Cadastrar
  const cadastrar = async() => {
    const retorno = await addDoc(collection(baseDados, 'clientes'), {
        nome:nome,
        idade:idade
    })

    let obj = {
      nome:nome,
      idade:idade,
      codigo:retorno.id
    }

    setVetor(() => [...vetor, obj]);
  }

  // Remover
  const remover = async(codigo) => {
    const retorno = await deleteDoc(doc(baseDados, 'clientes', codigo))
    .then(() => {setVetor(vetor.filter(cliente => {return cliente.codigo != codigo}))})
  }

  const alterar = async() => {
    await setDoc(doc(baseDados, 'clientes', 'dcpDf1KpgLSArD2jBnto'), {
      nome:'Larissa',
      idade:37
    })
  }

  // Retorno
  return (
    <View>

      <View style={{marginTop:70, width:300, marginLeft:50}}>
        <TextInput style={{marginBottom:20}} label="Nome"  onChangeText={setNome}  right={<TextInput.Icon icon="account"  />} />
        <TextInput style={{marginBottom:20}} label="Idade" onChangeText={setIdade} right={<TextInput.Icon icon="calendar" />} />
        <Button style={{width:150, marginLeft:80}} mode="contained" onPress={cadastrar}>Cadastrar</Button>
      </View>

      <DataTable style={{paddingTop:80}}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>Idade</DataTable.Title>
          <DataTable.Title>Remover</DataTable.Title>
        </DataTable.Header>

        {vetor.map((cliente, indice) => {
          return(
            <DataTable.Row key={indice}>
              <DataTable.Cell><Text>{cliente.nome}</Text></DataTable.Cell>
              <DataTable.Cell><Text>{cliente.idade}</Text></DataTable.Cell>
              <DataTable.Cell><Button onPress={() => {remover(cliente.codigo)}}>Remover</Button></DataTable.Cell>
            </DataTable.Row>
          )
        })}
      </DataTable>

    </View>
  );
}