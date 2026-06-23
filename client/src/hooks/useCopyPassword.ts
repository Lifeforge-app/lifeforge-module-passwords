import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { toast } from '@lifeforge/ui'

import { getDecryptedPassword } from '@/utils/getDecryptedPassword'

export default function useCopyPassword(masterPassword: string) {
  const [copyLoading, setCopyLoading] = useState(false)

  const copyPassword = useCallback(
    async (passwordId: string, decryptedPassword?: string | null) => {
      setCopyLoading(true)

      if (decryptedPassword) {
        copy(decryptedPassword)
        toast.success('Password copied!')
      } else {
        const decrypted = await getDecryptedPassword(masterPassword, passwordId)
        copy(decrypted)
        toast.success('Password copied!')
      }

      setCopyLoading(false)
    },
    [masterPassword]
  )

  return { copyPassword, copyLoading }
}
