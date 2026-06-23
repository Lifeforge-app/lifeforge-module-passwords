import { Flex, Icon, Text } from '@lifeforge/ui'

import type { PasswordEntry } from '../../..'

function PasswordInfo({ password }: { password: PasswordEntry }) {
  return (
    <Flex align="center" gap="md" minWidth="0" width="100%">
      <Flex
        centered
        shadow
        p="md"
        r="md"
        style={{
          backgroundColor: password.color + '50'
        }}
      >
        <Icon
          icon={password.icon}
          size="1.5em"
          style={{ color: password.color }}
        />
      </Flex>
      <Flex direction="column" flex="1" minWidth="0">
        <Text truncate size="xl" weight="semibold">
          {password.name}
        </Text>
        <Text truncate color="muted">
          {password.username}
        </Text>
      </Flex>
    </Flex>
  )
}

export default PasswordInfo
