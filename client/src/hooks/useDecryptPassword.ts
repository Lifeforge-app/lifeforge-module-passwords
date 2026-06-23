import { useCallback, useState } from 'react'

import { toast } from '@lifeforge/ui'
import { useModuleTranslation } from '@lifeforge/localization'

import { decrypt } from '@/utils/crypto'

export default function useDecryptPassword(
  vek: CryptoKey | null,
  encryptedPassword: string
) {
  const { t } = useModuleTranslation()
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )

  const toggleDecrypt = useCallback(async () => {
    if (decryptedPassword !== null) {
      setDecryptedPassword(null)
      return
    }

    if (!vek) return

    try {
      const result = await decrypt(encryptedPassword, vek)
      setDecryptedPassword(result)
    } catch {
      toast.error(t('toasts.decryptFailed'))
      setDecryptedPassword(null)
    }
  }, [vek, encryptedPassword, decryptedPassword])

  return { decryptedPassword, toggleDecrypt, setDecryptedPassword }
}
