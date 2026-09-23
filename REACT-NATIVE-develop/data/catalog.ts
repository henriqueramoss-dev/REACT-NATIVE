export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  frequency: string;
  benefits: string[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: 'cut',
    name: 'Corte tradicional',
    description: 'Corte personalizado com acabamento e finalização.',
    duration: 45,
    price: 50,
  },
  {
    id: 'beard',
    name: 'Barba',
    description: 'Modelagem, toalha quente e finalização da barba.',
    duration: 30,
    price: 35,
  },
  {
    id: 'combo',
    name: 'Corte + barba',
    description: 'Experiência completa para renovar o visual.',
    duration: 75,
    price: 75,
  },
  {
    id: 'finishing',
    name: 'Acabamento',
    description: 'Contorno da nuca, costeletas e acabamento da barba.',
    duration: 20,
    price: 25,
  },
];

export const plans: Plan[] = [
  {
    id: 'essential',
    name: 'Essencial',
    description: 'Para manter o corte sempre em dia.',
    price: 89,
    frequency: 'por mês',
    benefits: ['2 cortes por mês', 'Prioridade no agendamento', '5% em produtos'],
  },
  {
    id: 'complete',
    name: 'Clube Completo',
    description: 'Cabelo e barba cuidados o mês inteiro.',
    price: 149,
    frequency: 'por mês',
    featured: true,
    benefits: ['2 cortes por mês', '2 serviços de barba', 'Prioridade no agendamento', '10% em produtos'],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Mais liberdade para cuidar do visual.',
    price: 219,
    frequency: 'por mês',
    benefits: ['Cortes ilimitados', '2 serviços de barba', 'Horários exclusivos', '15% em produtos'],
  },
];

export function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
