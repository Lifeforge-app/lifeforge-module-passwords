import { ClientError, type IPBService } from '@lifeforge/server-utils'
import bcrypt from 'bcryptjs'

import schema from '../schema'

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

  const isMatch = await bcrypt.compare(decryptedMaster, masterPasswordHash)

  if (!isMatch) {
    throw new ClientError('Invalid master password', 401)
  }

  return decryptedMaster
}
