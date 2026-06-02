import React, { useState } from "react";
// ANOTAÇÃO: Importa o 'Platform' para diferenciar o comportamento do alerta no Navegador vs Celular
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { cadastrarUsuario } from "../database";

export default function CadastroScreen({ navigation, theme }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function fazerCadastro() {
    if (!nome || !email || !senha) {
      if (Platform.OS === "web") {
        alert("Erro: Preencha todos os campos.");
      } else {
        Alert.alert("Erro", "Preencha todos os campos.");
      }
      return;
    }

    // Executa a inserção dos dados no banco/localStorage
    const resultado = cadastrarUsuario(nome, email, senha);

    if (resultado.sucesso) {
      // ANOTAÇÃO: Se for ambiente Web, usa o alert comum e navega. Se for celular, usa o Alert nativo com botão.
      if (Platform.OS === "web") {
        alert("Sucesso: Usuário cadastrado com sucesso!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      }
    } else {
      if (Platform.OS === "web") {
        alert(`Erro: ${resultado.erro}`);
      } else {
        Alert.alert("Erro", resultado.erro);
      }
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>Criar Conta</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={[styles.botao, { backgroundColor: theme.primary }]} onPress={fazerCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: theme.primary }]}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  titulo: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 15 },
  botao: { padding: 15, borderRadius: 10 },
  botaoTexto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 20, fontWeight: "bold" },
});