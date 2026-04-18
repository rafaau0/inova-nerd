type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

export function consumeRateLimit(
  key: string,
  options: {
    limit: number
    windowMs: number
  }
) {
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt,
    }
  }

  if (current.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: current.resetAt,
    }
  }

  current.count += 1
  rateLimitStore.set(key, current)

  return {
    success: true,
    remaining: options.limit - current.count,
    resetAt: current.resetAt,
  }
}
