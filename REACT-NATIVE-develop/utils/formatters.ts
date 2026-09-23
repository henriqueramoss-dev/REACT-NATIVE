export function formatBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) {
    return `(${areaCode}) ${number}`;
  }

  if (digits.length <= 10) {
    return `(${areaCode}) ${number.slice(0, 4)}-${number.slice(4)}`;
  }

  return `(${areaCode}) ${number.slice(0, 5)}-${number.slice(5)}`;
}

export function formatBrazilianPostalCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatTime(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function isValidTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;

  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}
