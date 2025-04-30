import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';


const alturaStatusBar = StatusBar.currentHeight;
const KEY_GEMINI = 'AIzaSyDHg-xXy2vTBaCCF378YgCZ9sUM-pbKUME'; 

const genAI = new GoogleGenerativeAI(KEY_GEMINI);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});


const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};


export default function Tela3() {

  const [tituloReceita, setTituloReceita] = useState("");
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");

  const [genero1, setGenero1] = useState("");
  const [ambiente1, setAmbiente1] = useState("");
  const [tema1, setTema1] = useState("");
  const [emocaoDesejada, setEmocaoDesejada] = useState("");

  async function gerarReceita() {
    if (genero1 === "" || ambiente1 === "" || tema1 === "" || emocaoDesejada === "") {
      Alert.alert("Atenção", "Informe todos os ingredientes!", [{ text: "Beleza!" }]);
      return;
    }
    setReceita("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `
    Sugira um filme ou série baseada em: ${genero1}, ${ambiente1}, ${tema1}, ${emocaoDesejada}.

    IMPORTANTE:
    - Primeiro escreva o título da recomendação (exemplo: "Suspense na Neve"), depois uma quebra de linha (\n).
    - Em seguida, descreva a sinopse e por que é interessante.
    - No final, se possível, adicione um link do YouTube relacionado (trailer).
    `;

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);

      const respostaTexto = result.response.text(); 
      const linhas = respostaTexto.split('\n');    
      const titulo = linhas[0];                     
      
      setTituloReceita(titulo); 
      setReceita(respostaTexto); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Sujestão de filmes</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os tópicos abaixo:</Text>
        <TextInput
          placeholder="Gênero 1"
          style={ESTILOS.input}
          value={genero1}
          onChangeText={(texto) => setGenero1(texto)}
        />
        <TextInput
          placeholder="Ambiente 1"
          style={ESTILOS.input}
          value={ambiente1}
          onChangeText={(texto) => setAmbiente1(texto)}
        />
        <TextInput
          placeholder="Tema 1 "
          style={ESTILOS.input}
          value={tema1}
          onChangeText={(texto) => setTema1(texto)}
        />
        <TextInput
          placeholder="Emoção Desejada"
          style={ESTILOS.input}
          value={emocaoDesejada}
          onChangeText={(texto) => setEmocaoDesejada(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarReceita}>
        <Text style={ESTILOS.buttonText}>Gerar filme</Text>
        <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Buscando um filme...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {receita && (
          <View style={ESTILOS.content}>
           <Text style={ESTILOS.title}>{tituloReceita ? tituloReceita : "Sua receita 👇"}</Text>
            <Text style={{ lineHeight: 24 }}>{receita}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ffce30',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});
