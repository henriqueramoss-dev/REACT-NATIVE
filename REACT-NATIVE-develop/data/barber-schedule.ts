export type PageTab = 'agenda' | 'hours';
export type AppointmentStatus = 'confirmed' | 'completed' | 'no-show';

export type BarberAppointment = {
  id: string;
  time: string;
  customer: string;
  service: string;
  duration: string;
  price: string;
  status: AppointmentStatus;
};

export type WorkDay = {
  id: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

export const initialAppointments: BarberAppointment[] = [
  { id: 'today-1', time: '09:00', customer: 'Carlos Mendes', service: 'Corte tradicional', duration: '45 min', price: 'R$ 50,00', status: 'confirmed' },
  { id: 'today-2', time: '10:30', customer: 'André Souza', service: 'Corte + barba', duration: '1h15', price: 'R$ 75,00', status: 'confirmed' },
  { id: 'today-3', time: '14:00', customer: 'Matheus Rocha', service: 'Barba', duration: '30 min', price: 'R$ 35,00', status: 'confirmed' },
];

export const initialWorkDays: WorkDay[] = [
  { id: 'monday', label: 'Segunda-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'tuesday', label: 'Terça-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'wednesday', label: 'Quarta-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'thursday', label: 'Quinta-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'friday', label: 'Sexta-feira', enabled: true, start: '09:00', end: '20:00' },
  { id: 'saturday', label: 'Sábado', enabled: true, start: '08:00', end: '17:00' },
  { id: 'sunday', label: 'Domingo', enabled: false, start: '09:00', end: '13:00' },
];
