import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { buscarUsuario } from "../database";

export default function LoginScreen({ navigation, theme, setUsuarioLogado }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function fazerLogin() {
    const usuario = buscarUsuario(email, senha);

    if (usuario) {
      setUsuarioLogado(usuario); // Salva os dados (incluindo se é operador ou não)
      navigation.navigate("Lista");
    } else {
      Alert.alert("Erro", "Usuário/Email ou senha incorretos.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>Biblioteca Virtual</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Email ou Nome de Usuário"
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

      <TouchableOpacity style={[styles.botao, { backgroundColor: theme.primary }]} onPress={fazerLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={[styles.link, { color: theme.primary }]}>Criar conta</Text>
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