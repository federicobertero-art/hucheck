// Pure query helpers. No I/O, no external imports — unit-tested directly.
import { type QueryOpts } from './types';

/** Applies filter/sort/limit in memory (used by the IndexedDB adapter). */
export function applyQueryOpts<T>(items: T[], opts?: QueryOpts): T[] {
  let out = items;

  if (opts?.filter) {
    const entries = Object.entries(opts.filter);
    out = out.filter(item =>
      entries.every(([k, v]) => (item as Record<string, unknown>)[k] === v),
    );
  }

  if (opts?.sort) {
    const { field, dir } = opts.sort;
    const factor = dir === 'desc' ? -1 : 1;
    out = [...out].sort((a, b) => {
      const av = (a as Record<string, unknown>)[field];
      const bv = (b as Record<string, unknown>)[field];
      if (av === bv) return 0;
      return (av! < bv! ? -1 : 1) * factor;
    });
  }

  if (opts?.limit != null) out = out.slice(0, opts.limit);

  return out;
}

/** Translates QueryOpts into a PostgREST query string (used by the Supabase adapter). */
export function toSupabaseParams(opts?: QueryOpts): string {
  if (!opts) return '';
  const params = new URLSearchParams();
  if (opts.filter) {
    for (const [k, v] of Object.entries(opts.filter))
      params.append(k, `eq.${v}`);
  }
  if (opts.sort) params.append('order', `${opts.sort.field}.${opts.sort.dir}`);
  if (opts.limit != null) params.append('limit', String(opts.limit));
  const s = params.toString();
  return s ? `?${s}` : '';
}
