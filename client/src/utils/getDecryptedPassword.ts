import { decrypt, encrypt } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export async function getDecryptedPassword(
  masterPassword: string,
  id: string
): Promise<string> {
  const challenge = await forgeAPI.entries.getChallenge.query()

  const encryptedMaster = encrypt(masterPassword, challenge)

  const decrypted = await forgeAPI.entries.decrypt
    .input({
      id,
      master: encryptedMaster
    })
    .mutate(undefined)

  return decrypt(decrypted, challenge)
}
