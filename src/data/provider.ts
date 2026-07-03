// Single swap point between local (IndexedDB) and cloud (Supabase) data.
// Set VITE_DATA_BACKEND=supabase to use the cloud; defaults to local idb.

import { idbProvider } from './idb-provider';
import { supabaseProvider } from './supabase-provider';
import { type DataProvider } from './types';

const backend = import.meta.env.VITE_DATA_BACKEND ?? 'idb';

export const provider: DataProvider =
  backend === 'supabase' ? supabaseProvider : idbProvider;

export type { DataProvider, Entity, QueryOpts } from './types';
