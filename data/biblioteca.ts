export type Livro = {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  isbn: string;
  disponivel: boolean;
  descricao: string;
};

export const livros: Livro[] = [
  {
    id: '1',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    categoria: 'Romance',
    ano: 1899,
    isbn: '978-85-359-0277-5',
    disponivel: true,
    descricao: 'Romance clássico da literatura brasileira narrado por Bentinho.',
  },
  {
    id: '2',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    categoria: 'Literatura',
    ano: 1943,
    isbn: '978-85-9508-151-2',
    disponivel: false,
    descricao: 'Uma história sobre amizade, responsabilidade e aquilo que realmente importa.',
  },
  {
    id: '3',
    titulo: '1984',
    autor: 'George Orwell',
    categoria: 'Ficção',
    ano: 1949,
    isbn: '978-85-359-1484-9',
    disponivel: true,
    descricao: 'Distopia sobre vigilância, poder e controle social.',
  },
];

export const autores = [
  { id: '1', nome: 'Machado de Assis', nacionalidade: 'Brasileiro' },
  { id: '2', nome: 'Antoine de Saint-Exupéry', nacionalidade: 'Francês' },
  { id: '3', nome: 'George Orwell', nacionalidade: 'Britânico' },
];

export const categorias = [
  { id: '1', nome: 'Romance', quantidade: 12 },
  { id: '2', nome: 'Literatura', quantidade: 18 },
  { id: '3', nome: 'Ficção', quantidade: 9 },
];

export const emprestimos = [
  {
    id: '1',
    livro: 'O Pequeno Príncipe',
    retirada: '08/10/2026',
    devolucao: '22/10/2026',
    status: 'Em andamento',
  },
];
