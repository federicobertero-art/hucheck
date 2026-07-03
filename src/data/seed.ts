// Pure seeding helpers. No I/O — unit-tested directly.

export type SeedData = Record<string, unknown[]>;

/** Resource names in the seed file (only array-valued keys are resources). */
export function resourcesFromSeed(seed: Record<string, unknown>): string[] {
  return Object.keys(seed).filter(k => Array.isArray(seed[k]));
}

/**
 * Decides what to write into a store on startup. We seed only when the store is
 * empty, so data the user has created (or edited) is never overwritten.
 */
export function itemsToSeed<T>(existingCount: number, seedItems: T[]): T[] {
  return existingCount === 0 ? seedItems : [];
}
