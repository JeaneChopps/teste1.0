import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.text }]}>📚 Bem-vindo à GeekBooks</Text>
      <Text style={[styles.subtitulo, { color: theme.text }]}>Onde seus universos favoritos se encontram.</Text>

      {/* REQUISITO: Botão de entrada direta no catálogo */}
      <TouchableOpacity 
        style={[styles.botaoLoja, { backgroundColor: "#2ecc71" }]} 
        onPress={() => navigation.navigate("Lista")}
      >
        <Text style={styles.botaoLojaTexto}>🚀 Vamo dar uma olhada na loja</Text>
      </TouchableOpacity>

      <View style={styles.divisorRow}>
        <View style={styles.linha} />
        <Text style={{ color: "#888", marginHorizontal: 10 }}>ou acesse sua conta</Text>
        <View style={styles.linha} />
      </View>

      <View style={styles.botoesContaRow}>
        <TouchableOpacity 
          style={[styles.botaoConta, { backgroundColor: theme.primary }]} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.txtBotaoConta}>🔑 Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoConta, { backgroundColor: "#34495e" }]} 
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.txtBotaoConta}>📝 Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 25 },
  titulo: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  subtitulo: { fontSize: 15, fontStyle: "italic", marginBottom: 40, textAlign: "center", opacity: 0.7 },
  botaoLoja: { width: "100%", maxWidth: 320, padding: 18, borderRadius: 12, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  botaoLojaTexto: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 17 },
  divisorRow: { flexDirection: "row", alignItems: "center", width: "100%", maxWidth: 320, marginVertical: 30 },
  linha: { flex: 1, height: 1, backgroundColor: "#ccc" },
  botoesContaRow: { flexDirection: "row", gap: 12, width: "100%", maxWidth: 320 },
  botaoConta: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  txtBotaoConta: { color: "#fff", fontWeight: "600", fontSize: 14 }
});