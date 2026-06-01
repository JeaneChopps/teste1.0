// Importa o React e o useState para armazenar os dados digitados
import React, { useState } from "react";

// Importa componentes visuais do React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

// Importa o AsyncStorage para salvar e recuperar dados do celular
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente principal da tela de login
export default function LoginScreen({
  navigation,
  theme,
}) {

  // Armazena o email digitado
  const [email, setEmail] =
    useState("");

  // Armazena a senha digitada
  const [senha, setSenha] =
    useState("");

  // Função executada quando o usuário clica em Entrar
  async function fazerLogin() {

    // Busca o usuário salvo no celular
    const usuario =
      await AsyncStorage.getItem(
        "usuario"
      );

    // Verifica se existe usuário cadastrado
    if (!usuario) {
      Alert.alert(
        "Erro",
        "Nenhum usuário cadastrado."
      );
      return;
    }

    // Converte os dados salvos para objeto
    const dados = JSON.parse(usuario);

    // Verifica se email e senha estão corretos
    if (
      email === dados.email &&
      senha === dados.senha
    ) {

      // Vai para a tela da lista de livros
      navigation.navigate("Lista");

    } else {

      // Mostra mensagem de erro
      Alert.alert(
        "Erro",
        "Email ou senha incorretos."
      );

    }
  }

  return (

    // Container principal da tela
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >

      {/* Título do aplicativo */}
      <Text
        style={[
          styles.titulo,
          {
            color: theme.text,
          },
        ]}
      >
        Biblioteca Virtual
      </Text>

      {/* Campo de email */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor:
              theme.input,
          },
        ]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de senha */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor:
              theme.input,
          },
        ]}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão de login */}
      <TouchableOpacity
        style={[
          styles.botao,
          {
            backgroundColor:
              theme.primary,
          },
        ]}
        onPress={fazerLogin}
      >
        <Text
          style={styles.botaoTexto}
        >
          Entrar
        </Text>
      </TouchableOpacity>

      {/* Link para tela de cadastro */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            "Cadastro"
          )
        }
      >
        <Text
          style={[
            styles.link,
            {
              color:
                theme.primary,
            },
          ]}
        >
          Criar conta
        </Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  // Título
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  // Campos de entrada
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  // Botão entrar
  botao: {
    padding: 15,
    borderRadius: 10,
  },

  // Texto do botão
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // Link criar conta
  link: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});