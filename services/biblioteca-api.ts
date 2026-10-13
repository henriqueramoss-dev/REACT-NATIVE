const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type Perfil = {
  id: number;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  usuario?: Usuario;
};

export type AutorApi = {
  id: number;
  nome: string;
};

export type CategoriaApi = {
  id: number;
  nome: string;
};

export type LivroApi = {
  id: number;
  titulo: string;
  isbn: string;
  anoPublicacao: number;
  categoria: CategoriaApi;
  autores: AutorApi[];
};

export type EmprestimoApi = {
  id: number;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
  status: string;
  usuario: Usuario;
  livro: LivroApi;
};

function getApiUrl() {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada.');
  }

  return API_URL.replace(/\/$/, '');
}

function getEmbeddedItems<T>(data: any): T[] {
  if (!data?._embedded) {
    return [];
  }

  const firstList = Object.values(data._embedded)[0];
  return Array.isArray(firstList) ? (firstList as T[]) : [];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = 'Erro ao acessar a API.';

    try {
      const body = await response.json();
      message = body?.message || body?.detail || message;
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function listarLivros() {
  const data = await request<any>('/livros?size=50');
  return getEmbeddedItems<LivroApi>(data);
}

export async function buscarLivroPorId(id: number) {
  return request<LivroApi>(`/livros/${id}`);
}

export async function listarAutores() {
  const data = await request<any>('/autores?size=50');
  return getEmbeddedItems<AutorApi>(data);
}

export async function listarCategorias() {
  const data = await request<any>('/categorias?size=50');
  return getEmbeddedItems<CategoriaApi>(data);
}

export async function listarEmprestimos() {
  const data = await request<any>('/emprestimos?size=50');
  return getEmbeddedItems<EmprestimoApi>(data);
}

export async function criarUsuario(nome: string, email: string) {
  return request<Usuario>('/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nome, email }),
  });
}

export async function criarPerfil(
  usuarioId: number,
  telefone: string,
  endereco: string,
  dataNascimento: string,
) {
  return request<Perfil>('/perfis', {
    method: 'POST',
    body: JSON.stringify({
      telefone,
      endereco,
      dataNascimento,
      usuarioId,
    }),
  });
}
