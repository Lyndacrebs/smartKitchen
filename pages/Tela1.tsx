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


export default function Tela1() {

  const [tituloPratica, setTituloPratica] = useState("");
  const [load, setLoad] = useState(false);
  const [pratica, setPratica] = useState("");

  const [habito1, setIngr1] = useState("");
  const [habito2, setIngr2] = useState("");
  const [habito3, setIngr3] = useState("");
  const [habito4, setIngr4] = useState("");
  const [habito5, setOcasiao] = useState("");

  async function gerarPratica() {
    if (habito1 === "" || habito2 === "" || habito3 === "" || habito4 === "" || habito5 === "") {
      Alert.alert("Atenção", "Informe todos os hábitos!", [{ text: "Beleza!" }]);
      return;
    }
    setPratica("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `
    Me dê dicas práticas para melhorar a saúde considerando: ${habito1}, ${habito2}, ${habito3}, ${habito4} e ${habito5}.

    IMPORTANTE:
    - Primeiro escreva apenas um título chamativo (sem explicações), depois dê uma quebra de linha (\n).
    - Em seguida, descreva as dicas detalhadas, organizadas por tópicos.
    - No final, se possível, adicione um link do YouTube relacionado.
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
      
      setTituloPratica(titulo); 
      setPratica(respostaTexto); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Rotina Personalizada</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os hábitos abaixo:</Text>
        <TextInput
          placeholder="Hábito 1"
          style={ESTILOS.input}
          value={habito1}
          onChangeText={(texto) => setIngr1(texto)}
        />
        <TextInput
          placeholder="Hábito 2"
          style={ESTILOS.input}
          value={habito2}
          onChangeText={(texto) => setIngr2(texto)}
        />
        <TextInput
          placeholder="Hábito 3"
          style={ESTILOS.input}
          value={habito3}
          onChangeText={(texto) => setIngr3(texto)}
        />
        <TextInput
          placeholder="Hábito 4"
          style={ESTILOS.input}
          value={habito4}
          onChangeText={(texto) => setIngr4(texto)}
        />
        <TextInput
          placeholder="Hábito 5 "
          style={ESTILOS.input}
          value={habito5}
          onChangeText={(texto) => setOcasiao(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarPratica}>
        <Text style={ESTILOS.buttonText}>Gerar Prática</Text>
        <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Gerando Rotina...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {pratica && (
          <View style={ESTILOS.content}>
           <Text style={ESTILOS.title}>{tituloPratica ? tituloPratica : "Sua receita 👇"}</Text>
            <Text style={{ lineHeight: 24 }}>{pratica}</Text>
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
    backgroundColor: '#e389b9',
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
