async function deriveKey(masterPassword: string): Promise<CryptoKey> {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(masterPassword)
  )

  const hashBase64 = btoa(
    String.fromCharCode(...new Uint8Array(hashBuffer))
  ).slice(0, 32)

  const keyBytes = new TextEncoder().encode(hashBase64)

  return crypto.subtle.importKey('raw', keyBytes, 'AES-CTR', false, [
    'encrypt',
    'decrypt'
  ])
}

export async function encrypt(
  plaintext: string,
  masterPassword: string
): Promise<string> {
  const key = await deriveKey(masterPassword)
  const iv = crypto.getRandomValues(new Uint8Array(16))
  const data = new TextEncoder().encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CTR', counter: iv, length: 128 },
    key,
    data
  )

  const result = new Uint8Array(16 + ciphertext.byteLength)
  result.set(iv)
  result.set(new Uint8Array(ciphertext), 16)

  return btoa(String.fromCharCode(...result))
}

export async function decrypt(
  encryptedBase64: string,
  masterPassword: string
): Promise<string> {
  const key = await deriveKey(masterPassword)
  const encrypted = Uint8Array.from(atob(encryptedBase64), c =>
    c.charCodeAt(0)
  )

  const iv = encrypted.slice(0, 16)
  const ciphertext = encrypted.slice(16)

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-CTR', counter: iv, length: 128 },
    key,
    ciphertext
  )

  return new TextDecoder().decode(plaintext)
}
