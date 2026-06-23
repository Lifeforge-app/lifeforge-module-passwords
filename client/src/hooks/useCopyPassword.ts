import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { toast } from '@lifeforge/ui'
import { useModuleTranslation } from '@lifeforge/localization'

import { decrypt } from '@/utils/crypto'

export default function useCopyPassword(vek: CryptoKey | null) {
  const { t } = useModuleTranslation()
  const [copyLoading, setCopyLoading] = useState(false)

  const copyPassword = useCallback(
    async (encryptedPassword: string, decryptedPassword?: string | null) => {
      setCopyLoading(true)

      if (decryptedPassword) {
        copy(decryptedPassword)
        toast.success(t('toasts.passwordCopied'))
      } else if (vek) {
        const result = await decrypt(encryptedPassword, vek)
        copy(result)
        toast.success(t('toasts.passwordCopied'))
      }

      setCopyLoading(false)
    },
    [vek]
  )

  return { copyPassword, copyLoading }
}
