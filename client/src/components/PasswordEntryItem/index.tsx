import type { PasswordEntry } from '@'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Card, Flex, Icon } from '@lifeforge/ui'

import PasswordActions from './components/PasswordActions'
import PasswordInfo from './components/PasswordInfo'

function PasswordEntryItem({
  password,
  pinPassword,
  masterPassword
}: {
  password: PasswordEntry
  pinPassword: (id: string) => Promise<void>
  masterPassword: string
}) {
  const { t } = useModuleTranslation()

  return (
    <Card>
      {password.pinned && (
        <Box
          asChild
          left="0"
          position="absolute"
          style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
          top="0"
        >
          <Icon color="custom-500" icon="tabler:pin-filled" size="1.5em" />
        </Box>
      )}
      <Flex align="center" gap="sm" width="100%">
        <PasswordInfo password={password} />
        <PasswordActions
          masterPassword={masterPassword}
          password={password}
          pinPassword={pinPassword}
          t={t}
        />
      </Flex>
    </Card>
  )
}

export default PasswordEntryItem