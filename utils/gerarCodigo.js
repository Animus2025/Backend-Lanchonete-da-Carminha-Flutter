
// Objeto em memória para armazenar os códigos gerados (apenas para teste)
const codigosVerificacao = {};

// Gera e salva o código em memória
exports.gerarCodigo = (numero) => {
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const criadoEm = Date.now();

  codigosVerificacao[numero] = { codigo, criadoEm };
  console.log('[GERAR] Código salvo em memória:', { numero, codigo, criadoEm });

  return codigo;
};

// Função para obter o código salvo para um número
exports.obterCodigo = (numero) => {
  return codigosVerificacao[numero] || null;
};

exports.formatarNumeroWhatsApp = (numero) => {
  return numero.replace(/\D/g, '') + '@s.whatsapp.net';
};

// Exporte o objeto para uso em outros módulos, se necessário
exports.codigosVerificacao = codigosVerificacao;

