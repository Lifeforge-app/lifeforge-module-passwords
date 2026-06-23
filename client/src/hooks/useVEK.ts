import { useEffect, useState } from 'react'

import { unwrapVEK } from '@/utils/vek'

export default function useVEK(
  masterPassword: string,
  wrappedVEK: string
): { vek: CryptoKey | null } {
  const [vek, setVEK] = useState<CryptoKey | null>(null)

  useEffect(() => {
    if (!masterPassword || !wrappedVEK) return

    unwrapVEK(wrappedVEK, masterPassword)
      .then(setVEK)
      .catch(() => setVEK(null))
  }, [masterPassword, wrappedVEK])

  return { vek }
}
