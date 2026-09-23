export type BarberService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  stock: number;
  cost: number;
  price: number;
};

export type BarberPlan = {
  id: string;
  name: string;
  price: number;
  subscribers: number;
  active: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  appointments: number;
  lastVisit: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const initialBarberServices: BarberService[] = [
  { id: 'service-1', name: 'Corte tradicional', duration: 45, price: 50, active: true },
  { id: 'service-2', name: 'Barba', duration: 30, price: 35, active: true },
  { id: 'service-3', name: 'Corte + barba', duration: 75, price: 75, active: true },
  { id: 'service-4', name: 'Acabamento', duration: 20, price: 25, active: true },
];

export const initialProducts: Product[] = [
  { id: 'product-1', name: 'Pomada modeladora', stock: 12, cost: 18, price: 35 },
  { id: 'product-2', name: 'Óleo para barba', stock: 8, cost: 22, price: 45 },
  { id: 'product-3', name: 'Shampoo masculino', stock: 5, cost: 20, price: 39 },
];

export const initialBarberPlans: BarberPlan[] = [
  { id: 'plan-1', name: 'Essencial', price: 89, subscribers: 14, active: true },
  { id: 'plan-2', name: 'Clube Completo', price: 149, subscribers: 9, active: true },
  { id: 'plan-3', name: 'Premium', price: 219, subscribers: 4, active: true },
];

export const initialStaff: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'João Santos',
    specialty: 'Corte e barba',
    phone: '(11) 99999-1111',
    active: true,
  },
  {
    id: 'staff-2',
    name: 'Marcos Lima',
    specialty: 'Cortes modernos',
    phone: '(11) 98888-2222',
    active: true,
  },
];

export const initialCustomers: Customer[] = [
  { id: 'customer-1', name: 'Carlos Mendes', phone: '(11) 97777-1001', appointments: 8, lastVisit: 'Hoje' },
  { id: 'customer-2', name: 'André Souza', phone: '(11) 97777-1002', appointments: 5, lastVisit: 'Há 3 dias' },
  { id: 'customer-3', name: 'Matheus Rocha', phone: '(11) 97777-1003', appointments: 11, lastVisit: 'Há 1 semana' },
  { id: 'customer-4', name: 'Bruno Lima', phone: '(11) 97777-1004', appointments: 3, lastVisit: 'Há 2 semanas' },
];

export const initialTransactions: Transaction[] = [
  { id: 'transaction-1', description: 'Corte - Carlos Mendes', amount: 50, type: 'income', date: 'Hoje' },
  { id: 'transaction-2', description: 'Corte + barba - André Souza', amount: 75, type: 'income', date: 'Hoje' },
  { id: 'transaction-3', description: 'Compra de produtos', amount: 120, type: 'expense', date: 'Hoje' },
  { id: 'transaction-4', description: 'Barba - Matheus Rocha', amount: 35, type: 'income', date: 'Ontem' },
];

export const reportServices = [
  { name: 'Corte tradicional', appointments: 42, revenue: 2100 },
  { name: 'Corte + barba', appointments: 31, revenue: 2325 },
  { name: 'Barba', appointments: 25, revenue: 875 },
  { name: 'Acabamento', appointments: 14, revenue: 350 },
];

export const monthlyResults = [
  { month: 'Jun', revenue: 4100, expenses: 1250 },
  { month: 'Jul', revenue: 4650, expenses: 1380 },
  { month: 'Ago', revenue: 5020, expenses: 1470 },
  { month: 'Set', revenue: 5650, expenses: 1590 },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notification-1',
    title: 'Novo agendamento',
    message: 'Carlos Mendes agendou Corte tradicional para hoje às 16:00.',
    time: 'Há 10 min',
    read: false,
  },
  {
    id: 'notification-2',
    title: 'Avaliação recebida',
    message: 'Você recebeu uma nova avaliação de 5 estrelas.',
    time: 'Há 2 h',
    read: false,
  },
  {
    id: 'notification-3',
    title: 'Estoque baixo',
    message: 'O produto Shampoo masculino está com apenas 5 unidades.',
    time: 'Ontem',
    read: true,
  },
];
