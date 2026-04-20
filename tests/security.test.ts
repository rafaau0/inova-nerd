import { describe, expect, it } from 'vitest'
import {
  createLegacyPasswordHash,
  hashPassword,
  needsPasswordRehash,
  verifyPassword,
} from '@/lib/security'

describe('security', () => {
  it('hashes passwords with scrypt and validates them', () => {
    const password = 'SenhaSegura123'
    const hash = hashPassword(password)

    expect(hash.startsWith('scrypt$')).toBe(true)
    expect(verifyPassword(password, hash)).toBe(true)
    expect(verifyPassword('senha-errada', hash)).toBe(false)
  })

  it('keeps compatibility with legacy sha256 hashes', () => {
    const password = 'Legado123'
    const legacyHash = createLegacyPasswordHash(password)

    expect(verifyPassword(password, legacyHash)).toBe(true)
    expect(needsPasswordRehash(legacyHash)).toBe(true)
  })

  it('rejects malformed password hashes without throwing', () => {
    expect(verifyPassword('SenhaSegura123', 'not-a-hex-hash')).toBe(false)
    expect(verifyPassword('SenhaSegura123', `scrypt$salt$${'z'.repeat(128)}`)).toBe(
      false
    )
  })
})
