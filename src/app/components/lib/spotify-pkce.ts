export function generateRandomString(length: number) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))

  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('')
}

export async function sha256(plain: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return await crypto.subtle.digest('SHA-256', data)
}

export function base64UrlEncode(buffer: ArrayBuffer) {
  return Buffer.from(new Uint8Array(buffer))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export async function createCodeChallenge(verifier: string) {
  const hashed = await sha256(verifier)
  return base64UrlEncode(hashed)
}