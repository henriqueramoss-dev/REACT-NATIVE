import type { UserRole } from '@/types/user';

export const roleNames: Record<UserRole, string> = {
  client: 'cliente',
  barber: 'barbeiro',
};

export const roleContent: Record<UserRole, { label: string; description: string }> = {
  client: {
    label: 'Cliente',
    description: 'Acesse seus agendamentos e escolha seu próximo serviço.',
  },
  barber: {
    label: 'Barbeiro',
    description: 'Cuide da agenda, dos serviços e da gestão da barbearia.',
  },
};
