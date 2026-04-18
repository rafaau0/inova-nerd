import crypto from 'node:crypto'

const PASSWORD_PREFIX = 'scrypt'
const PASSWORD_KEY_LENGTH = 64

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString('hex')
  return `${PASSWORD_PREFIX}$${salt}$${derived}`
}

export function verifyPassword(password: string, storedHash: string) {
  if (storedHash.startsWith(`${PASSWORD_PREFIX}$`)) {
    const [, salt, expected] = storedHash.split('$')

    if (!salt || !expected) {
      return false
    }

    const derived = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString('hex')
    return timingSafeEqualHex(derived, expected)
  }

  return timingSafeEqualHex(sha256(password), storedHash)
}

export function needsPasswordRehash(storedHash: string) {
  return !storedHash.startsWith(`${PASSWORD_PREFIX}$`)
}

export function signSha256(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

export function createLegacyPasswordHash(password: string) {
  return sha256(password)
}
