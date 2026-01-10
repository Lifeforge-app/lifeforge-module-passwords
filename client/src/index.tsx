import { WithMasterPassword } from 'lifeforge-ui'
import { useAuth } from 'shared'
import type { InferOutput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import ContentContainer from './components/ContentContainer'
import './index.css'

export type PasswordEntry = InferOutput<
  typeof forgeAPI.passwords.entries.list
>[number]

function Passwords() {
  const { userData } = useAuth()

  return (
    <WithMasterPassword
      controllers={{
        createPassword: forgeAPI.passwords.master.create,
        getChallenge: forgeAPI.passwords.master.getChallenge,
        verifyPassword: forgeAPI.passwords.master.verify
      }}
      hasMasterPassword={!!userData?.hasMasterPassword}
    >
      {masterPassword => <ContentContainer masterPassword={masterPassword} />}
    </WithMasterPassword>
  )
}

export default Passwords
