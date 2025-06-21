// utils/formatarNumero.js
function formatarNumero(numero) {
  let num = numero.replace(/\D/g, ''); // remove tudo que não for dígito
  if (!num.startsWith('55')) {
    num = '55' + num;
  }

  // Extrai DDD (após 55, dois dígitos)
  const ddd = num.substring(2, 4);

  // Se DDD entre 11 e 28, garante prefixo 9
  if (parseInt(ddd) >= 11 && parseInt(ddd) <= 28) {
    // Se não tem 9 após o DDD, adiciona
    if (num[4] !== '9') {
      num = num.slice(0, 4) + '9' + num.slice(4);
    }
  } else {
    // Para outros DDDs, remove o 9 após o DDD, se existir
    if (num[4] === '9') {
      num = num.slice(0, 4) + num.slice(5);
    }
  }

  return num;
}

module.exports = { formatarNumero };