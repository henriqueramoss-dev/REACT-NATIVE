export type AppointmentTab = 'upcoming' | 'history';
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';

export type Appointment = {
  id: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  status: AppointmentStatus;
};

const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function dateFromToday(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

export const initialAppointments: Appointment[] = [
  { id: 'appointment-1', service: 'Corte + barba', date: dateFromToday(2), time: '14:30', duration: '1h15', price: 'R$ 75,00', status: 'confirmed' },
  { id: 'appointment-2', service: 'Corte tradicional', date: dateFromToday(9), time: '10:00', duration: '45 min', price: 'R$ 50,00', status: 'confirmed' },
  { id: 'appointment-3', service: 'Barba', date: dateFromToday(-12), time: '16:00', duration: '30 min', price: 'R$ 35,00', status: 'completed' },
];

export const statusContent: Record<AppointmentStatus, { label: string; style: 'gold' | 'gray' | 'red' }> = {
  confirmed: { label: 'Confirmado', style: 'gold' },
  completed: { label: 'Concluído', style: 'gray' },
  cancelled: { label: 'Cancelado', style: 'red' },
};
