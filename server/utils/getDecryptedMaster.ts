import { ClientError, type IPBService } from '@lifeforge/server-utils'

import schema from '../schema'
import { verify } from './passwordHash'

export const getDecryptedMaster = async (
  pb: IPBService<typeof schema>,
  master: string,
  challenge: string,
  decrypt2: any
): Promise<string> => {
  const { masterPasswordHash } = pb.instance.authStore.record as unknown as {
    masterPasswordHash: string
  }

  const decryptedMaster = decrypt2(master, challenge)

  const isMatch = await verify(decryptedMaster, masterPasswordHash)

  if (!isMatch) {
    throw new ClientError('Invalid master password', 401)
  }

  return decryptedMaster
}
