export type AvailableDate = {
  id: string;
  weekday: string;
  day: string;
  month: string;
};

export const times = ['09:00', '10:00', '11:30', '13:30', '14:30', '16:00', '17:30', '19:00'];

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function buildAvailableDates(): AvailableDate[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      weekday: index === 0 ? 'Hoje' : weekdays[date.getDay()],
      day: String(date.getDate()).padStart(2, '0'),
      month: months[date.getMonth()],
    };
  });
}

export const availableDates = buildAvailableDates();
