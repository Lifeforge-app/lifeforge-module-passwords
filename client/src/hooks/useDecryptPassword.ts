import { useCallback, useState } from 'react'

import { toast } from '@lifeforge/ui'

import { getDecryptedPassword } from '@/utils/getDecryptedPassword'

export default function useDecryptPassword(
  masterPassword: string,
  passwordId: string
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
      const decrypted = await getDecryptedPassword(masterPassword, passwordId)
      setDecryptedPassword(decrypted)
    } catch {
      toast.error("Couldn't decrypt the password. Please try again.")
      setDecryptedPassword(null)
    }
  }, [masterPassword, passwordId, decryptedPassword])

  return { decryptedPassword, toggleDecrypt, setDecryptedPassword }
}
