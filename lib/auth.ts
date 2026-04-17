import 'server-only'

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createSession,
  createUser,
  deleteSession,
  findSession,
  findUserByEmail,
  findUserById,
  toAuthUser,
} from './server-store'
import type { AuthUser, UserRecord } from './types'

const SESSION_COOKIE = 'inovanerd_session'
const SESSION_DURATION_DAYS = 7

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

export async function registerUser(input: {
  nome: string
  email: string
  password: string
  cpf?: string
  telefone?: string
}) {
  const existing = await findUserByEmail(input.email)
  if (existing) {
    return {
      success: false as const,
      error: 'Ja existe uma conta com este e-mail.',
    }
  }

  const user: UserRecord = {
    id: generateId('usr'),
    nome: input.nome.trim(),
    email: input.email.trim().toLowerCase(),
    cpf: input.cpf?.trim() || '',
    telefone: input.telefone?.trim() || '',
    passwordHash: hashPassword(input.password),
    role: 'customer',
    createdAt: new Date().toISOString(),
  }

  await createUser(user)
  const authUser = await createUserSession(user)
  return { success: true as const, user: authUser }
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user || user.passwordHash !== hashPassword(password)) {
    return {
      success: false as const,
      error: 'E-mail ou senha invalidos.',
    }
  }

  const authUser = await createUserSession(user)
  return { success: true as const, user: authUser }
}

async function createUserSession(user: UserRecord): Promise<AuthUser> {
  const token = crypto.randomBytes(24).toString('hex')
  const createdAt = new Date()
  const expiresAt = new Date(createdAt)
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  await createSession({
    token,
    userId: user.id,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })

  return toAuthUser(user)
}

export async function logoutUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  if (sessionToken) {
    await deleteSession(sessionToken)
    cookieStore.delete(SESSION_COOKIE)
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionToken) return null

  const session = await findSession(sessionToken)
  if (!session) return null

  if (new Date(session.expiresAt) < new Date()) {
    await deleteSession(sessionToken)
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  const user = await findUserById(session.userId)
  if (!user) return null

  return toAuthUser(user)
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/entrar')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== 'admin') {
    redirect('/minha-conta')
  }
  return user
}
