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
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};


export default function Tela3() {

  const [tituloReceita, setTituloReceita] = useState("");
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");

  const [ingr1, setIngr1] = useState("");
  const [ingr2, setIngr2] = useState("");
  const [ingr3, setIngr3] = useState("");
  const [ingr4, setIngr4] = useState("");
  const [ocasiao, setOcasiao] = useState("");

  async function gerarReceita() {
    if (ingr1 === "" || ingr2 === "" || ingr3 === "" || ingr4 === "" || ocasiao === "") {
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
      <Text style={ESTILOS.header}>Cozinha fácil</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os ingredientes abaixo:</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={ESTILOS.input}
          value={ingr1}
          onChangeText={(texto) => setIngr1(texto)}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={ESTILOS.input}
          value={ingr2}
          onChangeText={(texto) => setIngr2(texto)}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={ESTILOS.input}
          value={ingr3}
          onChangeText={(texto) => setIngr3(texto)}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={ESTILOS.input}
          value={ingr4}
          onChangeText={(texto) => setIngr4(texto)}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={ESTILOS.input}
          value={ocasiao}
          onChangeText={(texto) => setOcasiao(texto)}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarReceita}>
        <Text style={ESTILOS.buttonText}>Gerar receita</Text>
        <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={ESTILOS.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Produzindo receita...</Text>
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
