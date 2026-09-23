export type RatingFilter = 'all' | 5 | 4 | 3;

export type Review = {
  id: string;
  customer: string;
  initials: string;
  rating: number;
  service: string;
  date: string;
  comment: string;
  helpful: number;
};

export const reviews: Review[] = [
  { id: 'review-1', customer: 'Carlos M.', initials: 'CM', rating: 5, service: 'Corte + barba', date: 'Há 2 dias', comment: 'Atendimento excelente, sem atrasos e com muito cuidado nos detalhes. Voltarei com certeza.', helpful: 8 },
  { id: 'review-2', customer: 'André S.', initials: 'AS', rating: 5, service: 'Corte tradicional', date: 'Há 1 semana', comment: 'O corte ficou exatamente como pedi. Ambiente organizado e atendimento muito profissional.', helpful: 5 },
  { id: 'review-3', customer: 'Matheus R.', initials: 'MR', rating: 4, service: 'Barba', date: 'Há 2 semanas', comment: 'Gostei bastante do resultado e da atenção durante o atendimento.', helpful: 3 },
  { id: 'review-4', customer: 'Bruno L.', initials: 'BL', rating: 5, service: 'Acabamento', date: 'Há 3 semanas', comment: 'Serviço rápido e acabamento muito bem feito. Recomendo.', helpful: 2 },
];

export const distribution = [
  { stars: 5, percentage: 82 },
  { stars: 4, percentage: 14 },
  { stars: 3, percentage: 4 },
  { stars: 2, percentage: 0 },
  { stars: 1, percentage: 0 },
];
