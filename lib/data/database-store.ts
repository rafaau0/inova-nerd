import 'server-only'

import type { DataStore } from './contracts'

function notImplemented(method: string): never {
  throw new Error(
    `DATA_PROVIDER=database configurado, mas o adaptador de banco ainda nao foi implementado. Metodo: ${method}.`
  )
}

export function createDatabaseDataStore(): DataStore {
  return {
    readProducts() {
      return Promise.reject(notImplemented('readProducts'))
    },
    writeProducts() {
      return Promise.reject(notImplemented('writeProducts'))
    },
    readCoupons() {
      return Promise.reject(notImplemented('readCoupons'))
    },
    writeCoupons() {
      return Promise.reject(notImplemented('writeCoupons'))
    },
    readOrders() {
      return Promise.reject(notImplemented('readOrders'))
    },
    writeOrders() {
      return Promise.reject(notImplemented('writeOrders'))
    },
    readUsers() {
      return Promise.reject(notImplemented('readUsers'))
    },
    writeUsers() {
      return Promise.reject(notImplemented('writeUsers'))
    },
    readSessions() {
      return Promise.reject(notImplemented('readSessions'))
    },
    writeSessions() {
      return Promise.reject(notImplemented('writeSessions'))
    },
  }
}
