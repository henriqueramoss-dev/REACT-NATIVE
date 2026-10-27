import { useCallback, useEffect, useState } from 'react';

import { list } from '@/services/biblioteca-api';
import { RESOURCES, type Option, type ResourceKey } from '@/services/resources';

/** Carrega os registros de outro recurso para os campos de seleção (até 200 itens). */
export function useOptions(key: ResourceKey | undefined) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string>();

  const reload = useCallback(async () => {
    if (!key) return;
    const resource = RESOURCES[key];

    try {
      const page = await list<any>(resource.key, resource.embeddedKey, { size: 200 });
      setOptions(page.items.map((item) => ({ value: String(item.id), label: resource.title(item) })));
      setError(undefined);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { options, loaded, error, reload };
}
