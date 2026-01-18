import { decrypt, encrypt } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

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
    .mutate({})

  return decrypt(decrypted, challenge)
}
