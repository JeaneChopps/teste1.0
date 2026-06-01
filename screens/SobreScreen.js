import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function SobreScreen({
  theme,
}) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.titulo,
          { color: theme.text },
        ]}
      >
        Sobre o Aplicativo
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        Biblioteca Virtual é um
        aplicativo desenvolvido
        para um trabalho escolar.
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        O sistema possui:
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        • Cadastro de usuário
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        • Login
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        • Lista de livros
      </Text>

      <Text
        style={[
          styles.texto,
          { color: theme.text },
        ]}
      >
        • Modo noturno
      </Text>

      <Text
        style={[
          styles.creditos,
          { color: theme.text },
        ]}
      >
        Desenvolvido por
        João Garaguso
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  texto: {
    fontSize: 18,
    marginBottom: 12,
  },

  creditos: {
    fontSize: 16,
    marginTop: 30,
    fontWeight: "bold",
  },
});