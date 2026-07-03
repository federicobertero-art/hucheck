// Data layer contract — shared by the seed (mock/db.json) and Supabase tables.
//
// `consolidate-mocks` fills this file with a concrete interface per resource,
// inferred from your mock data. Every resource must have a string `id`.
//
// Example (generated later):
//   export interface Todo extends Entity { title: string; done: boolean }

export interface Entity {
  id: string;
}

export interface QueryOpts {
  /** Equality match per field, e.g. { done: true }. */
  filter?: Record<string, unknown>;
  sort?: { field: string; dir: 'asc' | 'desc' };
  limit?: number;
}

export interface DataProvider {
  list<T extends Entity>(resource: string, opts?: QueryOpts): Promise<T[]>;
  get<T extends Entity>(resource: string, id: string): Promise<T | null>;
  create<T extends Entity>(resource: string, data: Omit<T, 'id'>): Promise<T>;
  update<T extends Entity>(
    resource: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T>;
  remove(resource: string, id: string): Promise<void>;
}
