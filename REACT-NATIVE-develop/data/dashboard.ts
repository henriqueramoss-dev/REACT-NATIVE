import type { UserRole } from '@/types/user';

export type DashboardContent = {
  eyebrow: string;
  title: string;
  description: string;
  modules: {
    title: string;
    description: string;
    route?:
      | '/novo-agendamento'
      | '/meus-horarios'
      | '/servicos-planos'
      | '/avaliacoes'
      | '/conta'
      | '/agenda-barbeiro'
      | '/servicos-barbeiro'
      | '/produtos'
      | '/planos-barbeiro'
      | '/funcionarios'
      | '/clientes'
      | '/financeiro'
      | '/relatorios'
      | '/notificacoes';
  }[];
};

export const dashboards: Record<UserRole, DashboardContent> = {
  client: {
    eyebrow: 'ÁREA DO CLIENTE',
    title: 'Olá! Vamos cuidar do seu próximo horário?',
    description: 'Agende serviços e acompanhe tudo em um só lugar.',
    modules: [
      { title: 'Novo agendamento', description: 'Escolha serviço, barbeiro e horário.', route: '/novo-agendamento' },
      { title: 'Meus horários', description: 'Consulte, remarque ou cancele.', route: '/meus-horarios' },
      { title: 'Serviços e planos', description: 'Veja preços, imagens e benefícios.', route: '/servicos-planos' },
      { title: 'Avaliações', description: 'Veja opiniões e avalie atendimentos concluídos.', route: '/avaliacoes' },
      { title: 'Minha conta', description: 'Perfil, senha e preferências de notificações.', route: '/conta' },
    ],
  },
  barber: {
    eyebrow: 'GESTÃO DA BARBEARIA',
    title: 'Agenda e administração em uma única visão.',
    description: 'Atenda seus clientes e acompanhe toda a operação do negócio.',
    modules: [
      { title: 'Agenda e horários', description: 'Atendimentos de hoje e horários de trabalho.', route: '/agenda-barbeiro' },
      { title: 'Serviços', description: 'CRUD de serviços, preços, duração e imagens.', route: '/servicos-barbeiro' },
      { title: 'Produtos', description: 'CRUD de produtos, custos, preços e estoque.', route: '/produtos' },
      { title: 'Planos', description: 'Crie planos e acompanhe assinaturas.', route: '/planos-barbeiro' },
      { title: 'Funcionários', description: 'Cadastre profissionais quando ampliar a equipe.', route: '/funcionarios' },
      { title: 'Clientes', description: 'Gerencie clientes e históricos de atendimento.', route: '/clientes' },
      { title: 'Financeiro', description: 'Receitas, gastos e resultado por período.', route: '/financeiro' },
      { title: 'Relatórios e gráficos', description: 'Clientes, serviços e desempenho.', route: '/relatorios' },
      { title: 'Avaliações', description: 'Acompanhe a satisfação dos clientes.', route: '/avaliacoes' },
      { title: 'Notificações', description: 'Push, avisos e mensagens por e-mail.', route: '/notificacoes' },
    ],
  },
};
