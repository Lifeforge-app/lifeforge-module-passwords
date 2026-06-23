import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { toast } from '@lifeforge/ui'

import { decrypt } from '@/utils/crypto'

export default function useCopyPassword(masterPassword: string) {
  const [copyLoading, setCopyLoading] = useState(false)

  const copyPassword = useCallback(
    async (encryptedPassword: string, decryptedPassword?: string | null) => {
      setCopyLoading(true)

      if (decryptedPassword) {
        copy(decryptedPassword)
        toast.success('Password copied!')
      } else {
        const result = await decrypt(encryptedPassword, masterPassword)
        copy(result)
        toast.success('Password copied!')
      }

      setCopyLoading(false)
    },
    [masterPassword]
  )

  return { copyPassword, copyLoading }
}
