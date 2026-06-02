import { Platform } from "react-native";

let db = null;

// Só carrega o SQLite se NÃO for ambiente Web
if (Platform.OS !== "web") {
  try {
    const SQLite = require("expo-sqlite");
    db = SQLite.openDatabaseSync("biblioteca.db");
  } catch (erro) {
    console.log("Aviso: SQLite nativo não disponível neste ambiente.", erro);
  }
}

export function inicializarBanco() {
  if (Platform.OS === "web") {
    if (!localStorage.getItem("livros")) {
      const livrosIniciais = [
        { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", preco: "R$ 29,90", imagem: "1" },
        { id: 2, titulo: "Harry Potter", autor: "J. K. Rowling", preco: "R$ 49,90", imagem: "2" },
        { id: 3, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", preco: "R$ 24,90", imagem: "3" },
        { id: 4, titulo: "JoJo - Parte 9", autor: "Araki", preco: "R$ 69,90", imagem: "4" },
      ];
      localStorage.setItem("livros", JSON.stringify(livrosIniciais));
    }
    if (!localStorage.getItem("usuarios")) {
      localStorage.setItem("usuarios", JSON.stringify([]));
    }
    return;
  }

  // Inicialização Nativa (Celular)
  if (db) {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        preco TEXT NOT NULL,
        imagem TEXT NOT NULL
      );
    `);

    const total = db.getFirstSync("SELECT COUNT(*) as count FROM livros");
    if (total.count === 0) {
      db.execSync(`
        INSERT INTO livros (titulo, autor, preco, imagem) VALUES
          ('Dom Casmurro', 'Machado de Assis', 'R$ 29,90', '1'),
          ('Harry Potter', 'J. K. Rowling', 'R$ 49,90', '2'),
          ('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'R$ 24,90', '3'),
          ('JoJo - Parte 9', 'Araki', 'R$ 69,90', '4');
      `);
    }
  }
}

export function cadastrarUsuario(nome, email, senha) {
  if (Platform.OS === "web") {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (usuarios.some(u => u.email === email)) {
      return { sucesso: false, erro: "Este email já está cadastrado." };
    }
    usuarios.push({ id: Date.now(), nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return { sucesso: true };
  }

  try {
    if (db) {
      db.runSync("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha]);
      return { sucesso: true };
    }
  } catch (erro) {
    if (erro.message.includes("UNIQUE")) {
      return { sucesso: false, erro: "Este email já está cadastrado." };
    }
    return { sucesso: false, erro: "Erro ao cadastrar usuário." };
  }
  return { sucesso: false, erro: "Banco offline." };
}

export function buscarUsuario(email, senha) {
  if (email === "JoãoLucas1" && senha === "Ordos413") {
    return { id: 0, nome: "JoãoLucas1", email: "joao@operador.com", isOperador: true };
  }

  if (Platform.OS === "web") {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuario = usuarios.find(u => (u.email === email || u.nome === email) && u.senha === senha);
    return usuario ? { ...usuario, isOperador: false } : null;
  }

  try {
    if (db) {
      const usuario = db.getFirstSync(
        "SELECT * FROM usuarios WHERE (email = ? OR nome = ?) AND senha = ?",
        [email, email, senha]
      );
      return usuario ? { ...usuario, isOperador: false } : null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function buscarLivros() {
  if (Platform.OS === "web") {
    return JSON.parse(localStorage.getItem("livros") || "[]");
  }
  if (db) {
    return db.getAllSync("SELECT * FROM livros");
  }
  return [];
}

export function inserirLivro(titulo, autor, preco, imagem) {
  if (Platform.OS === "web") {
    const livros = JSON.parse(localStorage.getItem("livros") || "[]");
    livros.push({ id: Date.now(), titulo, autor, preco, imagem });
    localStorage.setItem("livros", JSON.stringify(livros));
    return true;
  }

  try {
    if (db) {
      db.runSync("INSERT INTO livros (titulo, autor, preco, imagem) VALUES (?, ?, ?, ?)", [titulo, autor, preco, imagem]);
      return true;
    }
  } catch (erro) {
    console.log("Erro ao inserir livro:", erro);
    return false;
  }
  return false;
}

export function atualizarLivro(id, titulo, autor, preco, imagem) {
  if (Platform.OS === "web") {
    let livros = JSON.parse(localStorage.getItem("livros") || "[]");
    livros = livros.map((l) => l.id === id ? { ...l, titulo, autor, preco, imagem } : l);
    localStorage.setItem("livros", JSON.stringify(livros));
    return true;
  }

  try {
    if (db) {
      db.runSync("UPDATE livros SET titulo = ?, autor = ?, preco = ?, imagem = ? WHERE id = ?", [titulo, autor, preco, imagem, id]);
      return true;
    }
  } catch (erro) {
    console.log("Erro ao atualizar livro:", erro);
    return false;
  }
  return false;
}

export function deletarLivro(id) {
  if (Platform.OS === "web") {
    let livros = JSON.parse(localStorage.getItem("livros") || "[]");
    livros = livros.filter((l) => l.id !== id);
    localStorage.setItem("livros", JSON.stringify(livros));
    return true;
  }

  try {
    if (db) {
      db.runSync("DELETE FROM livros WHERE id = ?", [id]);
      return true;
    }
  } catch (erro) {
    console.log("Erro ao deletar livro:", erro);
    return false;
  }
  return false;
}