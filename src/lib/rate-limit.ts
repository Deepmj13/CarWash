const rateMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxAttempts = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxAttempts) return false
  entry.count++
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(key)
  }
}, 60_000)
