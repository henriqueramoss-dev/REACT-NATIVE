import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { list } from '@/services/biblioteca-api';
import { RESOURCES, type Option, type ResourceKey } from '@/services/resources';

const PAGE_SIZE = 100; // máximo da API por página
const MAX_PAGES = 20; // trava de segurança: até 2000 opções

/**
 * Carrega os registros de outro recurso para os campos de seleção, percorrendo todas as páginas.
 * Recarrega sempre que a tela volta a ficar visível (ex.: depois de cadastrar um item pelo link "Cadastrar agora").
 */
export function useOptions(key: ResourceKey | undefined) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string>();

  const reload = useCallback(async () => {
    if (!key) return;
    const resource = RESOURCES[key];

    try {
      const all: Option[] = [];
      for (let page = 0; page < MAX_PAGES; page++) {
        const data = await list<any>(resource.key, resource.embeddedKey, { page, size: PAGE_SIZE });
        all.push(...data.items.map((item) => ({ value: String(item.id), label: resource.title(item) })));
        if (page >= data.totalPages - 1) break;
      }
      setOptions(all);
      setError(undefined);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { options, loaded, error, reload };
}
