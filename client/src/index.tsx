import type { InferOutput } from '@lifeforge/api'
import { useAuth } from '@lifeforge/api'
import { WithMasterPassword } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ContentContainer from './components/ContentContainer'

export type PasswordEntry = InferOutput<typeof forgeAPI.entries.list>[number]

function Passwords() {
  const { userData } = useAuth()

  return (
    <WithMasterPassword
      controllers={{
        createPassword: forgeAPI.master.create,
        getChallenge: forgeAPI.master.getChallenge,
        verifyPassword: forgeAPI.master.verify
      }}
      hasMasterPassword={!!userData?.hasMasterPassword}
    >
      {masterPassword => <ContentContainer masterPassword={masterPassword} />}
    </WithMasterPassword>
  )
}

export default Passwords
