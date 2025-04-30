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


export default function Tela2() {

  const [tituloPlano, setTituloPlano] = useState("");
  const [load, setLoad] = useState(false);
  const [plano, setPlano] = useState("");

  const [idioma, setIdioma] = useState("");
  const [diasSemana, setDiasSemana] = useState("");
  const [foco1, setFoco1] = useState("");
  const [foco2, setFoco2] = useState("");

  async function gerarPlano() {
    if (idioma === "" || diasSemana === "" || foco1 === "" || foco2 === "") {
      Alert.alert("Atenção", "Informe todos os requisitos!", [{ text: "Beleza!" }]);
      return;
    }
    setPlano("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `
    Monte um plano de estudo de idiomas considerando: aprender ${idioma} com ${diasSemana} dias de estudo por semana, focando em ${foco1} e ${foco2}.

    IMPORTANTE:
    - Primeiro escreva o nome do plano de estudo (exemplo: "Plano Intensivo de Espanhol para Conversação"), depois uma quebra de linha (\\n).
    - Em seguida, detalhe o plano: atividades diárias, duração de cada sessão, recursos recomendados (livros, aplicativos, podcasts).
    - No final, se possível, adicione um link de apoio (exemplo: vídeo do YouTube, site ou podcast).
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
      
      setTituloPlano(titulo); 
      setPlano(respostaTexto); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Plano de Estudo</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os tópicos abaixo:</Text>
        <TextInput
          placeholder="Idioma"
          style={ESTILOS.input}
          value={idioma}
          onChangeText={(texto) => setIdioma(texto)}
        />
        <TextInput
          placeholder="Dias por semana"
          style={ESTILOS.input}
          value={diasSemana}
          onChangeText={(texto) => setDiasSemana(texto)}
        />
        <TextInput
          placeholder="Foco 1"
          style={ESTILOS.input}
          value={foco1}
          onChangeText={(texto) => setFoco1(texto)}
        />
        <TextInput
          placeholder="Foco 2"
          style={ESTILOS.input}
          value={foco2}
          onChangeText={(texto) => setFoco2(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarPlano}>
        <Text style={ESTILOS.buttonText}>Gerar plano</Text>
        <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Produzindo um plano...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {plano && (
          <View style={ESTILOS.content}>
           <Text style={ESTILOS.title}>{tituloPlano ? tituloPlano : "Seu Plano 👇"}</Text>
            <Text style={{ lineHeight: 24 }}>{plano}</Text>
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
    backgroundColor: '#746ab0',
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
