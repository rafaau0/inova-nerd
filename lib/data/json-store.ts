import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { DataStore } from './contracts'
import type {
  CouponDefinition,
  OrderRecord,
  Product,
  SessionRecord,
  UserRecord,
} from '@/lib/types'

const dataDir = process.env.INOVANERD_DATA_DIR || path.join(process.cwd(), 'data')

const files = {
  products: path.join(dataDir, 'products.json'),
  coupons: path.join(dataDir, 'coupons.json'),
  orders: path.join(dataDir, 'orders.json'),
  users: path.join(dataDir, 'users.json'),
  sessions: path.join(dataDir, 'sessions.json'),
}

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true })
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir()
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function createJsonDataStore(): DataStore {
  return {
    readProducts() {
      return readJsonFile<Product[]>(files.products, [])
    },
    writeProducts(products) {
      return writeJsonFile(files.products, products)
    },
    readCoupons() {
      return readJsonFile<CouponDefinition[]>(files.coupons, [])
    },
    writeCoupons(coupons) {
      return writeJsonFile(files.coupons, coupons)
    },
    readOrders() {
      return readJsonFile<OrderRecord[]>(files.orders, [])
    },
    writeOrders(orders) {
      return writeJsonFile(files.orders, orders)
    },
    readUsers() {
      return readJsonFile<UserRecord[]>(files.users, [])
    },
    writeUsers(users) {
      return writeJsonFile(files.users, users)
    },
    readSessions() {
      return readJsonFile<SessionRecord[]>(files.sessions, [])
    },
    writeSessions(sessions) {
      return writeJsonFile(files.sessions, sessions)
    },
  }
}
