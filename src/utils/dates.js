// Funções simples para datas e máscaras de digitação.
// Este arquivo é JavaScript puro (sem tipos) de propósito: são funções pequenas e fáceis de ler.
// O resto do projeto (TypeScript) importa daqui.

/** Aplica a máscara DD/MM/AAAA enquanto o usuário digita. */
export function maskDate(text) {
  const digits = text.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** "10/05/2000" → "2000-05-10" (formato aceito pela API). */
export function brToIso(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
}

/** "2000-05-10" → "10/05/2000". Valores fora do formato são devolvidos sem alteração. */
export function isoToBr(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

/** Converte "2026-10-09" em "09/10/2026". */
export function formatDate(iso) {
  return iso ? isoToBr(iso) : '—';
}

/** Confere formato AAAA-MM-DD e se a data existe (ex.: 31/02 é inválida). */
export function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [ano, mes, dia] = value.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

/** Data de hoje em AAAA-MM-DD. today(7) = daqui a 7 dias, today(-1) = ontem. */
export function today(offsetDays = 0) {
  const data = new Date();
  data.setDate(data.getDate() + offsetDays);
  const doisDigitos = (n) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}
