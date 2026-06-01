import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const livros = [
  {
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    preco: "R$ 29,90",
    imagem: require("../assets/1.jpg"),
  },
  {
    titulo: "Harry Potter",
    autor: "J. K. Rowling",
    preco: "R$ 49,90",
    imagem: require("../assets/2.jpg"),
  },
  {
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    preco: "R$ 24,90",
    imagem: require("../assets/3.jpg"),
  },
  {
    titulo: "JoJo - Parte 9 ",
    autor: "Araki",
    preco: "R$ 69,90",
    imagem: require("../assets/4.jpg"),
  },
];

export default function ListaScreen({
  navigation,
  theme,
}) {
  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.botao,
          {
            backgroundColor:
              theme.primary,
          },
        ]}
        onPress={() =>
          navigation.navigate("Sobre")
        }
      >
        <Text style={styles.botaoTexto}>
          Sobre o App
        </Text>
      </TouchableOpacity>

      {livros.map((livro, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
            },
          ]}
        >
          <Image
            source={livro.imagem}
            style={styles.imagem}
          />

          <View style={styles.info}>
            <Text
              style={[
                styles.titulo,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {livro.titulo}
            </Text>

            <Text
              style={[
                styles.autor,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Autor: {livro.autor}
            </Text>

            <Text
              style={[
                styles.preco,
                {
                  color:
                    theme.primary,
                },
              ]}
            >
              {livro.preco}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  botao: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  imagem: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  autor: {
    fontSize: 15,
    marginBottom: 10,
  },

  preco: {
    fontSize: 18,
    fontWeight: "bold",
  },
});