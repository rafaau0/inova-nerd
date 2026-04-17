import 'server-only'

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createUser,
  findUserByEmail,
  findUserById,
  toAuthUser,
} from './server-store'
import type { AuthUser, UserRecord } from './types'

const SESSION_COOKIE = 'inovanerd_session'
const SESSION_DURATION_DAYS = 7
const SESSION_SECRET = process.env.SESSION_SECRET || 'inovanerd-local-session-secret'

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

function signSessionPayload(payload: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
}

function encodeSession(userId: string, expiresAt: string) {
  const payload = JSON.stringify({ userId, expiresAt })
  const payloadBase64 = Buffer.from(payload, 'utf-8').toString('base64url')
  const signature = signSessionPayload(payloadBase64)
  return `${payloadBase64}.${signature}`
}

function decodeSession(token: string) {
  const [payloadBase64, signature] = token.split('.')
  if (!payloadBase64 || !signature) return null

  const expectedSignature = signSessionPayload(payloadBase64)
  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8')) as {
      userId: string
      expiresAt: string
    }
    return payload
  } catch {
    return null
  }
}

export async function registerUser(input: {
  nome: string
  email: string
  password: string
  cpf?: string
  telefone?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
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
    cep: input.cep?.trim() || '',
    endereco: input.endereco?.trim() || '',
    numero: input.numero?.trim() || '',
    complemento: input.complemento?.trim() || '',
    bairro: input.bairro?.trim() || '',
    cidade: input.cidade?.trim() || '',
    estado: input.estado?.trim().toUpperCase() || '',
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
  const createdAt = new Date()
  const expiresAt = new Date(createdAt)
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)
  const token = encodeSession(user.id, expiresAt.toISOString())

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
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionToken) return null

  const session = decodeSession(sessionToken)
  if (!session) return null

  if (new Date(session.expiresAt) < new Date()) {
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
