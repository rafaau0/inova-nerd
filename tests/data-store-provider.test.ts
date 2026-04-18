import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const originalDataProvider = process.env.DATA_PROVIDER
const originalNodeEnv = process.env.NODE_ENV

describe('data store provider selection', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()

    if (originalDataProvider === undefined) {
      delete process.env.DATA_PROVIDER
    } else {
      process.env.DATA_PROVIDER = originalDataProvider
    }

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = originalNodeEnv
    }
  })

  it('uses the JSON adapter by default', async () => {
    delete process.env.DATA_PROVIDER

    const jsonStore = { kind: 'json' }
    const databaseStore = { kind: 'database' }

    vi.doMock('@/lib/data/json-store', () => ({
      createJsonDataStore: vi.fn(() => jsonStore),
    }))
    vi.doMock('@/lib/data/database-store', () => ({
      createDatabaseDataStore: vi.fn(() => databaseStore),
    }))

    const { getDataStore, isJsonDataStore, isProductionJsonDataStore } = await import(
      '@/lib/data'
    )

    expect(getDataStore()).toBe(jsonStore)
    expect(isJsonDataStore()).toBe(true)
    expect(isProductionJsonDataStore()).toBe(false)
  })

  it('uses the database adapter when DATA_PROVIDER=database', async () => {
    process.env.DATA_PROVIDER = 'database'

    const jsonStore = { kind: 'json' }
    const databaseStore = { kind: 'database' }

    vi.doMock('@/lib/data/json-store', () => ({
      createJsonDataStore: vi.fn(() => jsonStore),
    }))
    vi.doMock('@/lib/data/database-store', () => ({
      createDatabaseDataStore: vi.fn(() => databaseStore),
    }))

    const { getDataStore, isJsonDataStore, isProductionJsonDataStore } = await import(
      '@/lib/data'
    )

    expect(getDataStore()).toBe(databaseStore)
    expect(isJsonDataStore()).toBe(false)
    expect(isProductionJsonDataStore()).toBe(false)
  })

  it('flags JSON storage in production', async () => {
    process.env.DATA_PROVIDER = 'json'
    process.env.NODE_ENV = 'production'

    vi.doMock('@/lib/data/json-store', () => ({
      createJsonDataStore: vi.fn(() => ({ kind: 'json' })),
    }))
    vi.doMock('@/lib/data/database-store', () => ({
      createDatabaseDataStore: vi.fn(() => ({ kind: 'database' })),
    }))

    const { isProductionJsonDataStore } = await import('@/lib/data')

    expect(isProductionJsonDataStore()).toBe(true)
  })
})
