import { promises as fs } from 'node:fs'
import path from 'node:path'
import postgres from 'postgres'
import { loadProjectEnv } from './load-env.mjs'

loadProjectEnv()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL nao configurada.')
}

const schemaPath = path.join(process.cwd(), 'db', 'schema.sql')
const schemaSql = await fs.readFile(schemaPath, 'utf-8')

if (!schemaSql.trim()) {
  throw new Error('db/schema.sql esta vazio.')
}

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
})

try {
  await sql.unsafe(schemaSql)
  console.log('Schema aplicado com sucesso.')
} finally {
  await sql.end()
}
