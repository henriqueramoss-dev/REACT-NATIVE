/** Aplica a máscara DD/MM/AAAA enquanto o usuário digita. */
export function maskDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** "10/05/2000" → "2000-05-10" (formato aceito pela API). */
export function brToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
}

/** "2000-05-10" → "10/05/2000". Valores fora do formato são devolvidos sem alteração. */
export function isoToBr(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
