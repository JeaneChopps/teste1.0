// Importa o React e o useState para controlar o modo escuro
import React, { useState } from "react";

// Importa componentes visuais do React Native
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

// Importa a navegação entre telas
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importa as telas do aplicativo
import LoginScreen from "./screens/LoginScreen";
import CadastroScreen from "./screens/CadastroScreen";
import ListaScreen from "./screens/ListaScreen";
import SobreScreen from "./screens/SobreScreen";

// Importa os temas claro e escuro
import {
  lightTheme,
  darkTheme,
} from "./theme";

// Cria a pilha de navegação
const Stack = createNativeStackNavigator();

export default function App() {

  // Controla se o modo escuro está ativo
  const [darkMode, setDarkMode] =
    useState(false);

  // Escolhe qual tema será utilizado
  const theme = darkMode
    ? darkTheme
    : lightTheme;

  return (
    <>
      {/* Container principal da navegação */}
      <NavigationContainer>

        <Stack.Navigator
          screenOptions={{
            // Cor da barra superior
            headerStyle: {
              backgroundColor:
                theme.primary,
            },

            // Cor dos textos da barra superior
            headerTintColor: "#fff",
          }}
        >

          {/* Tela de Login */}
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                theme={theme}
              />
            )}
          </Stack.Screen>

          {/* Tela de Cadastro */}
          <Stack.Screen name="Cadastro">
            {(props) => (
              <CadastroScreen
                {...props}
                theme={theme}
              />
            )}
          </Stack.Screen>

          {/* Tela da Lista de Livros */}
          <Stack.Screen name="Lista">
            {(props) => (
              <ListaScreen
                {...props}
                theme={theme}
              />
            )}
          </Stack.Screen>

          {/* Tela Sobre */}
          <Stack.Screen name="Sobre">
            {(props) => (
              <SobreScreen
                {...props}
                theme={theme}
              />
            )}
          </Stack.Screen>

        </Stack.Navigator>

      </NavigationContainer>

      {/* Botão flutuante para alternar tema */}
      <TouchableOpacity
        style={[
          styles.botaoTema,
          {
            backgroundColor:
              theme.primary,
          },
        ]}
        onPress={() =>
          setDarkMode(!darkMode)
        }
      >
        <Text style={styles.icone}>
          🌙
        </Text>
      </TouchableOpacity>
    </>
  );
}

// Estilos da tela
const styles = StyleSheet.create({

  // Botão flutuante
  botaoTema: {
    position: "absolute",
    bottom: 20,
    right: 20,

    width: 60,
    height: 60,

    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
  },

  // Emoji do botão
  icone: {
    fontSize: 24,
  },
});