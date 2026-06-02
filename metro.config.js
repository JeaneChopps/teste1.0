const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para carregar arquivos WebAssembly (.wasm) no navegador
config.resolver.assetExts.push('wasm');

module.exports = config;