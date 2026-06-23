export async function deriveKeyBytes(
  masterPassword: string
): Promise<ArrayBuffer> {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(masterPassword)
  )

  const hashBase64 = btoa(
    String.fromCharCode(...new Uint8Array(hashBuffer))
  ).slice(0, 32)

  return new TextEncoder().encode(hashBase64).buffer
}

export async function unwrapVEK(
  wrappedVEKBase64: string,
  masterPassword: string
): Promise<CryptoKey> {
  const keyBytes = await deriveKeyBytes(masterPassword)
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'AES-GCM',
    false,
    ['decrypt']
  )

  const wrapped = Uint8Array.from(atob(wrappedVEKBase64), c =>
    c.charCodeAt(0)
  )

  const iv = wrapped.slice(0, 12)
  const ciphertext = wrapped.slice(12)

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    wrappingKey,
    ciphertext
  )

  return crypto.subtle.importKey(
    'raw',
    plaintext,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  )
}

export async function wrapVEK(
  vekBytes: ArrayBuffer,
  masterPassword: string
): Promise<string> {
  const keyBytes = await deriveKeyBytes(masterPassword)
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    'AES-GCM',
    false,
    ['encrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    wrappingKey,
    vekBytes
  )

  const result = new Uint8Array(iv.length + ciphertext.byteLength)
  result.set(iv)
  result.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...result))
}
