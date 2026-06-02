import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert, // Adicionado Alert para notificações nativas
} from "react-native";

import { buscarLivros, inserirLivro, atualizarLivro, deletarLivro } from "../database";

const imagensLocais = {
  "1": require("../assets/1.jpg"),
  "2": require("../assets/2.jpg"),
  "3": require("../assets/3.jpg"),
  "4": require("../assets/4.jpg"),
};

export default function ListaScreen({ navigation, theme, usuarioLogado, setUsuarioLogado }) {
  const [livros, setLivros] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  
  const [modalCarrinhoVisivel, setModalCarrinhoVisivel] = useState(false);
  const [modalGerenciarVisivel, setModalGerenciarVisivel] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [livroSelecionadoId, setLivroSelecionadoId] = useState(null);
  const [formTitulo, setFormTitulo] = useState("");
  const [formAutor, setFormAutor] = useState("");
  const [formPreco, setFormPreco] = useState("");
  const [formImagem, setFormImagem] = useState("");

  const atualizarListaCatalogo = () => {
    const dados = buscarLivros();
    setLivros(dados || []);
  };

  useEffect(() => {
    atualizarListaCatalogo();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {usuarioLogado ? (
            <TouchableOpacity 
              style={styles.containerLogoutHeader} 
              onPress={() => {
                setUsuarioLogado(null);
                navigation.reset({ index: 0, routes: [{ name: "Home" }] });
              }}
            >
              <Text style={styles.txtNomeUsuarioHeader}>
                {usuarioLogado.isOperador ? "⚙️ " : ""}{usuarioLogado.nome}
              </Text>
              <Text style={styles.iconePortaHeader}>➡️🚪</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.containerLogoutHeader}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}
            >
              <Text style={styles.txtVisitanteHeader}>Modo Visitante 👀 ➡️🚪</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.botaoCarrinhoHeader} onPress={() => setModalCarrinhoVisivel(true)}>
            <Text style={styles.textoCarrinhoHeader}>
              🛒 Carrinho ({carrinho.reduce((sum, item) => sum + item.quantidade, 0)})
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, carrinho, usuarioLogado]);

  const obterFonteImagem = (imagem) => {
    const imgStr = String(imagem || "").trim();
    if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) {
      return { uri: imgStr };
    }
    return imagensLocais[imgStr] || require("../assets/1.jpg");
  };

  const abrirModalCriarNovo = () => {
    setModoEdicao(false);
    setLivroSelecionadoId(null);
    setFormTitulo("");
    setFormAutor("");
    setFormPreco("");
    setFormImagem("");
    setModalGerenciarVisivel(true);
  };

  const abrirModalEditarExistente = (livro) => {
    setModoEdicao(true);
    setLivroSelecionadoId(livro.id);
    setFormTitulo(livro.titulo);
    setFormAutor(livro.autor);
    setFormPreco(livro.preco.replace("R$", "").trim());
    setFormImagem(String(livro.imagem || ""));
    setModalGerenciarVisivel(true);
  };

  const handleSalvarGerenciamento = () => {
    if (!formTitulo || !formAutor || !formPreco) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const precoFormatado = formPreco.startsWith("R$") ? formPreco : `R$ ${formPreco}`;

    if (modoEdicao) {
      atualizarLivro(livroSelecionadoId, formTitulo, formAutor, precoFormatado, formImagem);
      Alert.alert("Sucesso", "Características alteradas com sucesso!");
    } else {
      inserirLivro(formTitulo, formAutor, precoFormatado, formImagem || "1");
      Alert.alert("Sucesso", "Novo livro integrado ao catálogo!");
    }

    setModalGerenciarVisivel(false);
    atualizarListaCatalogo();
  };

  const handleDeletarLivroOperador = (id) => {
    deletarLivro(id);
    Alert.alert("Sucesso", "Livro removido do catálogo!");
    atualizarListaCatalogo();
  };

  const adicionarAoCarrinho = (livro) => {
    setCarrinho((prevCarrinho) => {
      const itemExiste = prevCarrinho.find((item) => item.id === livro.id);
      if (itemExiste) {
        return prevCarrinho.map((item) =>
          item.id === livro.id ? { ...item, tongue: item.quantidade, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prevCarrinho, { ...livro, quantidade: 1 }];
    });
  };

  const alterarQuantidade = (id, operacao) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.map((item) => {
        if (item.id === id) {
          const novaQtd = operacao === "mais" ? item.quantidade + 1 : item.quantidade - 1;
          return novaQtd > 0 ? { ...item, quantidade: novaQtd } : item;
        }
        return item;
      })
    );
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((soma, item) => {
      const valorLimpo = parseFloat(String(item.preco).replace("R$", "").replace(",", ".").trim()) || 0;
      return soma + valorLimpo * item.quantidade;
    }, 0);
    return `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  };

  // REQUISITO: Impedir finalização de compra para visitantes
  const handleFinalizarCompra = () => {
    if (!usuarioLogado) {
      Alert.alert(
        "Acesso Restrito",
        "Visitantes não podem finalizar compras. Por favor, volte ao menu e faça login ou cadastre uma conta! 😉"
      );
      return;
    }

    setModalCarrinhoVisivel(false);
    setCarrinho([]);
    Alert.alert("Sucesso!", "Compra finalizada com sucesso!");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        
        {usuarioLogado?.isOperador && (
          <TouchableOpacity style={styles.btnCriarProdutoTop} onPress={abrirModalCriarNovo}>
            <Text style={styles.txtCriarProdutoTop}>➕ Cadastrar Novo Produto</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("Sobre")}
        >
          <Text style={styles.botaoTexto}>Sobre o App</Text>
        </TouchableOpacity>

        {livros.map((livro) => (
          <View key={livro.id} style={[styles.card, { backgroundColor: theme.card }]}>
            <Image source={obterFonteImagem(livro.imagem)} style={styles.imagem} />

            <View style={styles.info}>
              <Text style={[styles.titulo, { color: theme.text }]}>{livro.titulo}</Text>
              <Text style={[styles.autor, { color: theme.text }]}>Autor: {livro.autor}</Text>
              <Text style={[styles.preco, { color: theme.primary }]}>{livro.preco}</Text>
              
              <View style={{ flexDirection: "row", marginTop: 10, gap: 6, flexWrap: "wrap" }}>
                <TouchableOpacity
                  style={[styles.botaoAcao, { backgroundColor: "#2ecc71" }]}
                  onPress={() => { adicionarAoCarrinho(livro); Alert.alert("Carrinho", `${livro.titulo} adicionado.`); }}
                >
                  <Text style={styles.botaoAcaoTexto}>🛒 Comprar</Text>
                </TouchableOpacity>

                {usuarioLogado?.isOperador && (
                  <>
                    <TouchableOpacity
                      style={[styles.botaoAcao, { backgroundColor: "#3498db" }]}
                      onPress={() => abrirModalEditarExistente(livro)}
                    >
                      <Text style={styles.botaoAcaoTexto}>✏️ Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.botaoAcao, { backgroundColor: "#e74c3c" }]}
                      onPress={() => handleDeletarLivroOperador(livro.id)}
                    >
                      <Text style={styles.botaoAcaoTexto}>❌ Excluir</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- MODAL DO CARRINHO --- */}
      <Modal animationType="fade" transparent={true} visible={modalCarrinhoVisivel} onRequestClose={() => setModalCarrinhoVisivel(false)}>
        <View style={styles.modalFundo}>
          <View style={[styles.modalConteudo, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: theme.text }]}>Carrinho</Text>
              <TouchableOpacity onPress={() => setModalCarrinhoVisivel(false)}>
                <Text style={[styles.botaoFecharX, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 220 }}>
              {carrinho.length === 0 ? (
                <Text style={[styles.carrinhoVazio, { color: theme.text }]}>Seu carrinho está vazio.</Text>
              ) : (
                carrinho.map((item) => (
                  <View key={item.id} style={styles.itemCarrinhoRow}>
                    <Image source={obterFonteImagem(item.imagem)} style={styles.imagemMini} />
                    <View style={styles.itemCarrinhoDetalhes}>
                      <Text style={[styles.itemCarrinhoTitulo, { color: theme.text }]}>{item.titulo}</Text>
                      <View style={styles.controlesPrecoRow}>
                        <View style={styles.boxQuantidade}>
                          <TouchableOpacity style={styles.btnQtd} onPress={() => alterarQuantidade(item.id, "menos")}>
                            <Text style={styles.txtBtnQtd}>-</Text>
                          </TouchableOpacity>
                          <Text style={[styles.txtQtd, { color: theme.text }]}>{item.quantidade}</Text>
                          <TouchableOpacity style={styles.btnQtd} onPress={() => alterarQuantidade(item.id, "mais")}>
                            <Text style={styles.txtBtnQtd}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.btnLixeira} onPress={() => removerDoCarrinho(item.id)}>
                          <Text style={styles.txtLixeira}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.divisor} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total a pagar:</Text>
              <Text style={styles.totalValor}>{calcularTotal()}</Text>
            </View>

            {/* Chamando a nova função de validação ao clicar */}
            <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizarCompra}>
              <Text style={styles.botaoFinalizarTexto}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE GERENCIAMENTO --- */}
      <Modal animationType="slide" transparent={true} visible={modalGerenciarVisivel} onRequestClose={() => setModalGerenciarVisivel(false)}>
        <View style={styles.modalFundo}>
          <View style={[styles.modalConteudo, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: theme.text }]}>
                {modoEdicao ? "✏️ Modificar Livro" : "➕ Novo Produto"}
              </Text>
              <TouchableOpacity onPress={() => setModalGerenciarVisivel(false)}>
                <Text style={[styles.botaoFecharX, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.labelInput, { color: theme.text }]}>Título do Livro</Text>
            <TextInput
              style={[styles.inputGerenciar, { color: theme.text, backgroundColor: "rgba(0,0,0,0.04)" }]}
              placeholder="Ex: Novo Livro Exemplo"
              placeholderTextColor="#999"
              value={formTitulo}
              onChangeText={setFormTitulo}
            />

            <Text style={[styles.labelInput, { color: theme.text }]}>Autor</Text>
            <TextInput
              style={[styles.inputGerenciar, { color: theme.text, backgroundColor: "rgba(0,0,0,0.04)" }]}
              placeholder="Ex: Nome do Autor"
              placeholderTextColor="#999"
              value={formAutor}
              onChangeText={setFormAutor}
            />

            <Text style={[styles.labelInput, { color: theme.text }]}>Preço</Text>
            <TextInput
              style={[styles.inputGerenciar, { color: theme.text, backgroundColor: "rgba(0,0,0,0.04)" }]}
              placeholder="Ex: 45,90"
              placeholderTextColor="#999"
              value={formPreco}
              onChangeText={setFormPreco}
            />

            <Text style={[styles.labelInput, { color: theme.text }]}>URL da Imagem</Text>
            <TextInput
              style={[styles.inputGerenciar, { color: theme.text, backgroundColor: "rgba(0,0,0,0.04)" }]}
              placeholder="Cole o link completo do Pinterest ou Web"
              placeholderTextColor="#999"
              value={formImagem}
              onChangeText={setFormImagem}
            />

            <TouchableOpacity style={[styles.btnSalvarGerenciamento, { backgroundColor: theme.primary }]} onPress={handleSalvarGerenciamento}>
              <Text style={styles.txtBtnSalvarGerenciamento}>
                {modoEdicao ? "Salvar Características" : "Cadastrar Produto"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  botao: { padding: 15, borderRadius: 10, marginBottom: 15 },
  botaoTexto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  card: { flexDirection: "row", borderRadius: 12, padding: 10, marginBottom: 15, alignItems: "center" },
  imagem: { width: 100, height: 140, borderRadius: 10 },
  info: { flex: 1, marginLeft: 15 },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  autor: { fontSize: 15, marginBottom: 10 },
  preco: { fontSize: 18, fontWeight: "bold" },
  botaoAcao: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  botaoAcaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  headerRightContainer: { flexDirection: "column", alignItems: "flex-end", justifyContent: "center", paddingRight: 5 },
  containerLogoutHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginBottom: 5 },
  txtNomeUsuarioHeader: { color: "#fff", fontWeight: "bold", fontSize: 11, marginRight: 4 },
  iconePortaHeader: { fontSize: 11 },
  txtVisitanteHeader: { color: "#fff", fontSize: 11, fontStyle: "italic", fontWeight: "600" },
  botaoCarrinhoHeader: { backgroundColor: "#2ecc71", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  textoCarrinhoHeader: { color: "#fff", fontWeight: "bold", fontSize: 11 },

  modalFundo: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalConteudo: { width: "100%", maxWidth: 450, borderRadius: 15, padding: 20, elevation: 5 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitulo: { fontSize: 22, fontWeight: "bold" },
  botaoFecharX: { fontSize: 20, fontWeight: "bold", padding: 5 },
  carrinhoVazio: { textAlign: "center", marginVertical: 20, fontSize: 16, fontStyle: "italic" },
  itemCarrinhoRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  imagemMini: { width: 40, height: 55, borderRadius: 6 },
  itemCarrinhoDetalhes: { flex: 1, marginLeft: 15 },
  itemCarrinhoTitulo: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  controlesPrecoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  boxQuantidade: { flexDirection: "row", borderWidth: 1, borderColor: "#ddd", borderRadius: 6, alignItems: "center" },
  btnQtd: { paddingHorizontal: 10, paddingVertical: 4 },
  txtBtnQtd: { fontSize: 14, fontWeight: "bold" },
  txtQtd: { paddingHorizontal: 5, fontWeight: "bold" },
  btnLixeira: { padding: 5 },
  txtLixeira: { fontSize: 16 },
  divisor: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  totalLabel: { fontSize: 16 },
  totalValor: { fontSize: 20, fontWeight: "bold", color: "#2ecc71" },
  botaoFinalizar: { backgroundColor: "#2ecc71", padding: 15, borderRadius: 8, alignItems: "center" },
  botaoFinalizarTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  btnCriarProdutoTop: { backgroundColor: "#e67e22", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 5 },
  txtCriarProdutoTop: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  labelInput: { fontSize: 13, fontWeight: "600", marginBottom: 4, marginTop: 10 },
  inputGerenciar: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, fontSize: 15 },
  btnSalvarGerenciamento: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 25 },
  txtBtnSalvarGerenciamento: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});