import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import { buscarLivros, modificarLivro, removerLivro } from "../database";
import { imagensLivros } from "./ListaScreen";

export default function DetalhesScreen({ route, navigation, theme }) {
  const { livroId, isOperador } = route.params;

  const [livro, setLivro] = useState(null);
  const [editando, setEditando] = useState(false);

  // Estados locais para os inputs de edição do operador
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    const todos = buscarLivros();
    const encontrado = todos.find((l) => l.id === livroId);
    if (encontrado) {
      setLivro(encontrado);
      setTitulo(encontrado.titulo);
      setAutor(encontrado.autor);
      setPreco(encontrado.preco);
      setEstoque(String(encontrado.estoque));
      setImagem(encontrado.imagem);
    }
  }, [livroId]);

  function exibirAviso(tituloMsg, msg) {
    if (Platform.OS === "web") alert(`${tituloMsg}: ${msg}`);
    else Alert.alert(tituloMsg, msg);
  }

  function salvarAlteracoes() {
    const res = modificarLivro(livroId, titulo, autor, preco, imagem, estoque);
    if (res.sucesso) {
      exibirAviso("Sucesso", "Informações do produto alteradas!");
      setEditando(false);
      navigation.goBack();
    } else {
      exibirAviso("Erro", "Falha ao salvar modificações.");
    }
  }

  function deletarLivro() {
    const confirmar = Platform.OS === "web" ? window.confirm("Excluir este produto permanentemente?") : true;
    if (confirmar) {
      removerLivro(livroId);
      navigation.goBack();
    }
  }

  if (!livro) return <View style={styles.container}><Text>Carregando...</Text></View>;

  const imagemFonte = imagem.startsWith("http") ? { uri: imagem } : (imagensLivros[imagem] || imagensLivros["1"]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.conteudo}>
        
        <Image source={imagemFonte} style={styles.capa} />

        {isOperador && (
          <TouchableOpacity 
            style={[styles.botaoAcao, { backgroundColor: editando ? "#e74c3c" : theme.primary }]} 
            onPress={() => setEditando(!editando)}
          >
            <Text style={styles.txtBotao}>{editando ? "Cancelar Edição" : "⚙️ Editar Informações"}</Text>
          </TouchableOpacity>
        )}

        {editando ? (
          // INTERFACE DO OPERADOR (CAMPOS DE TEXTO PARA ALTERAR VALORES)
          <View style={styles.formulario}>
            <Text style={[styles.label, { color: theme.text }]}>Título do Livro:</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text }]} value={titulo} onChangeText={setTitulo} />

            <Text style={[styles.label, { color: theme.text }]}>Autor:</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text }]} value={autor} onChangeText={setAutor} />

            <Text style={[styles.label, { color: theme.text }]}>Preço:</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text }]} value={preco} onChangeText={setPreco} />

            <Text style={[styles.label, { color: theme.text }]}>Quantidade em Estoque:</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text }]} value={estoque} keyboardType="numeric" onChangeText={setEstoque} />

            <Text style={[styles.label, { color: theme.text }]}>URL da Imagem ou Código (1-4):</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.input, color: theme.text }]} value={imagem} onChangeText={setImagem} placeholder="Cole o link de uma imagem da internet" placeholderTextColor="#999" />

            <TouchableOpacity style={[styles.botaoSalvar, { backgroundColor: "#2ecc71" }]} onPress={salvarAlteracoes}>
              <Text style={styles.txtBotao}>💾 Salvar Modificações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.botaoSalvar, { backgroundColor: "#c0392b", marginTop: 10 }]} onPress={deletarLivro}>
              <Text style={styles.txtBotao}>🗑️ Excluir Livro do Sistema</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // INTERFACE NORMAL DO USUÁRIO (APENAS LEITURA DAS INFORMAÇÕES)
          <View style={styles.detalhes}>
            <Text style={[styles.titulo, { color: theme.text }]}>{livro.titulo}</Text>
            <Text style={[styles.autor, { color: theme.text }]}>Por: {livro.autor}</Text>
            <Text style={[styles.preco, { color: theme.primary }]}>Valor: {livro.preco}</Text>
            
            <View style={styles.caixaEstoque}>
              <Text style={styles.txtEstoque}>Estoque Disponível: {livro.estoque} unidades</Text>
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { padding: 20, alignItems: "center" },
  capa: { width: 160, height: 240, borderRadius: 12, marginBottom: 20, elevation: 4 },
  botaoAcao: { padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 20 },
  txtBotao: { color: "#fff", fontWeight: "bold" },
  formulario: { width: "100%" },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, width: "100%" },
  botaoSalvar: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  detalhes: { width: "100%", alignItems: "center", marginTop: 10 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  autor: { fontSize: 18, color: "#666", marginBottom: 15 },
  preco: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  caixaEstoque: { backgroundColor: "#eee", padding: 15, borderRadius: 10, width: "100%", alignItems: "center" },
  txtEstoque: { fontWeight: "bold", color: "#333" }
});