import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen"; // Importando a nova Home
import LoginScreen from "./screens/LoginScreen";
import CadastroScreen from "./screens/CadastroScreen";
import ListaScreen from "./screens/ListaScreen";
import SobreScreen from "./screens/SobreScreen";

import { lightTheme, darkTheme } from "./theme";
import { inicializarBanco } from "./database";

const Stack = createNativeStackNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null); 

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    inicializarBanco();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: theme.primary },
            headerTintColor: "#fff",
          }}
        >
          {/* Tela Principal do App */}
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} theme={theme} />}
          </Stack.Screen>

          <Stack.Screen name="Login" options={{ title: "Identificação" }}>
            {(props) => (
              <LoginScreen {...props} theme={theme} setUsuarioLogado={setUsuarioLogado} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Cadastro" options={{ title: "Nova Conta" }}>
            {(props) => <CadastroScreen {...props} theme={theme} />}
          </Stack.Screen>

          <Stack.Screen name="Lista" options={{ title: "Loja de Livros" }}>
            {(props) => (
              <ListaScreen
                {...props}
                theme={theme}
                usuarioLogado={usuarioLogado}
                setUsuarioLogado={setUsuarioLogado}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Sobre" options={{ title: "Sobre o Desenvolvedor" }}>
            {(props) => <SobreScreen {...props} theme={theme} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      {/* Botão Flutuante do Tema Escuro */}
      <TouchableOpacity style={[styles.botaoTema, { backgroundColor: theme.primary }]} onPress={() => setDarkMode(!darkMode)}>
        <Text style={styles.icone}>🌙</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  botaoTema: { position: "absolute", bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
  icone: { fontSize: 24 },
});