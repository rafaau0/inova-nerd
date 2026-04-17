import 'server-only'

import postgres from 'postgres'

let sqlInstance: postgres.Sql | null = null

export function getDb() {
  if (sqlInstance) {
    return sqlInstance
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL nao configurada.')
  }

  sqlInstance = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  return sqlInstance
}
