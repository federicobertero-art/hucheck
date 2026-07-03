// Supabase adapter. Talks only to the serverless proxy at /api/supabase
// (the frontend never holds Supabase keys). PostgREST-shaped query params.

import { toSupabaseParams } from './query';
import { type DataProvider, type Entity, type QueryOpts } from './types';

const BASE = '/api/supabase';

async function req<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok)
    throw new Error(`supabase ${method} ${path} failed: ${res.status}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const supabaseProvider: DataProvider = {
  list: <T extends Entity>(resource: string, opts?: QueryOpts): Promise<T[]> =>
    req<T[]>('GET', `${resource}${toSupabaseParams(opts)}`),
  get: async <T extends Entity>(
    resource: string,
    id: string,
  ): Promise<T | null> => {
    const rows = await req<T[]>('GET', `${resource}?id=eq.${id}`);
    return rows[0] ?? null;
  },
  create: <T extends Entity>(
    resource: string,
    data: Omit<T, 'id'>,
  ): Promise<T> => req<T>('POST', resource, data),
  update: <T extends Entity>(
    resource: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T> => req<T>('PATCH', `${resource}?id=eq.${id}`, patch),
  remove: (resource: string, id: string): Promise<void> =>
    req<void>('DELETE', `${resource}?id=eq.${id}`),
};
