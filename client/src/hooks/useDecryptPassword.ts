import { useCallback, useState } from 'react'

import { toast } from '@lifeforge/ui'

import { decrypt } from '@/utils/crypto'

export default function useDecryptPassword(
  masterPassword: string,
  encryptedPassword: string
) {
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )

  const toggleDecrypt = useCallback(async () => {
    if (decryptedPassword !== null) {
      setDecryptedPassword(null)

      return
    }

    try {
      const result = await decrypt(encryptedPassword, masterPassword)
      setDecryptedPassword(result)
    } catch {
      toast.error("Couldn't decrypt the password. Please try again.")
      setDecryptedPassword(null)
    }
  }, [masterPassword, encryptedPassword, decryptedPassword])

  return { decryptedPassword, toggleDecrypt, setDecryptedPassword }
}
