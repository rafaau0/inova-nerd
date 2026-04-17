import 'server-only'

import { createDatabaseDataStore } from './database-store'
import { createJsonDataStore } from './json-store'
import type { DataStore } from './contracts'

let cachedStore: DataStore | null = null

export function getDataStore(): DataStore {
  if (cachedStore) {
    return cachedStore
  }

  const provider = (process.env.DATA_PROVIDER || 'json').toLowerCase()

  cachedStore =
    provider === 'database' ? createDatabaseDataStore() : createJsonDataStore()

  return cachedStore
}

export function isJsonDataStore() {
  return (process.env.DATA_PROVIDER || 'json').toLowerCase() === 'json'
}

export function isProductionJsonDataStore() {
  return process.env.NODE_ENV === 'production' && isJsonDataStore()
}
