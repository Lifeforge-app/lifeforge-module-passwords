import type { InferOutput } from '@lifeforge/api'
import { WithMasterPassword, WithQueryData, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ContentContainer from './components/ContentContainer'
import RecoverAccountModal from './components/modals/RecoverAccountModal'
import ShowRecoveryKeyModal from './components/modals/ShowRecoveryKeyModal'

export type PasswordEntry = InferOutput<typeof forgeAPI.entries.list>[number]

export type PasswordCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

function Passwords() {
  const { open } = useModalStore()

  return (
    <WithQueryData controller={forgeAPI.master.hasMasterPassword}>
      {hasMasterPassword => (
        <WithMasterPassword
          controllers={{
            createPassword: forgeAPI.master.create,
            getChallenge: forgeAPI.master.getChallenge,
            verifyPassword: forgeAPI.master.verify
          }}
          hasMasterPassword={hasMasterPassword}
          onCreate={data => {
            if (data.recovery_key) {
              open(ShowRecoveryKeyModal, {
                recoveryKey: data.recovery_key
              })
            }
          }}
          onRecoveryRequested={() => {
            open(RecoverAccountModal, {})
          }}
        >
          {masterPassword => (
            <ContentContainer masterPassword={masterPassword} />
          )}
        </WithMasterPassword>
      )}
    </WithQueryData>
  )
}

export default Passwords
