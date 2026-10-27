import type { Ionicons } from '@expo/vector-icons';

import type { ResourceKey } from '@/services/resources';

// Mesma ordem e mesmos ícones do menu do site.
export const RESOURCE_ICONS: Record<ResourceKey, keyof typeof Ionicons.glyphMap> = {
  emprestimos: 'swap-horizontal-outline',
  livros: 'book-outline',
  autores: 'pencil-outline',
  categorias: 'pricetag-outline',
  usuarios: 'person-outline',
  perfis: 'id-card-outline',
};
