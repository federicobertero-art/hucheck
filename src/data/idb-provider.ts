// IndexedDB adapter. Local-first persistence that works in dev AND production.
// Seeds from mock/db.json on first run (per store, only when empty).
import { type IDBPDatabase, openDB } from 'idb';

import seedJson from '../../mock/db.json';

import { applyQueryOpts } from './query';
import { itemsToSeed, resourcesFromSeed, type SeedData } from './seed';
import { type DataProvider, type Entity, type QueryOpts } from './types';

const DB_NAME = 'app-data';
const DB_VERSION = 1;
const seed = seedJson as SeedData;
const resources = resourcesFromSeed(seed);

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const resource of resources) {
          if (!db.objectStoreNames.contains(resource)) {
            db.createObjectStore(resource, { keyPath: 'id' });
          }
        }
      },
    }).then(async db => {
      for (const resource of resources) {
        if (!db.objectStoreNames.contains(resource)) continue;
        const count = await db.count(resource);
        const toSeed = itemsToSeed(count, (seed[resource] as Entity[]) ?? []);
        if (toSeed.length) {
          const tx = db.transaction(resource, 'readwrite');
          for (const item of toSeed) tx.store.put(item);
          await tx.done;
        }
      }
      return db;
    });
  }
  return dbPromise;
}

export const idbProvider: DataProvider = {
  async list<T extends Entity>(
    resource: string,
    opts?: QueryOpts,
  ): Promise<T[]> {
    const db = await getDB();
    const all = (await db.getAll(resource)) as T[];
    return applyQueryOpts(all, opts);
  },
  async get<T extends Entity>(resource: string, id: string): Promise<T | null> {
    const db = await getDB();
    return ((await db.get(resource, id)) as T) ?? null;
  },
  async create<T extends Entity>(
    resource: string,
    data: Omit<T, 'id'>,
  ): Promise<T> {
    const db = await getDB();
    const item = { ...data, id: crypto.randomUUID() } as T;
    await db.put(resource, item);
    return item;
  },
  async update<T extends Entity>(
    resource: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T> {
    const db = await getDB();
    const existing = (await db.get(resource, id)) as T | undefined;
    if (!existing) throw new Error(`${resource} ${id} not found`);
    const updated = { ...existing, ...patch, id } as T;
    await db.put(resource, updated);
    return updated;
  },
  async remove(resource: string, id: string): Promise<void> {
    const db = await getDB();
    await db.delete(resource, id);
  },
};
