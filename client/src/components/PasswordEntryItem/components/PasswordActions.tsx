import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Text,
  toast,
  useModalStore
} from '@lifeforge/ui'

import ModifyPasswordModal from '@/components/modals/ModifyPasswordModal'
import {
  useCopyPassword,
  useDecryptPassword,
  useDeletePassword,
  useRotatePassword
} from '@/hooks'
import { decrypt } from '@/utils/crypto'

import type { PasswordEntry } from '../../..'

dayjs.extend(relativeTime)

function PasswordActions({
  password,
  pinPassword,
  t,
  vek
}: {
  password: PasswordEntry
  pinPassword: (id: string) => Promise<void>
  t: (key: string) => string
  vek: CryptoKey | null
}) {
  const { open } = useModalStore()
  const { copyPassword, copyLoading } = useCopyPassword(vek)

  const { decryptedPassword, toggleDecrypt, setDecryptedPassword } =
    useDecryptPassword(vek, password.password)

  const [loading, onDecrypt] = usePromiseLoading(toggleDecrypt)

  const { rotatePassword, rotateLoading } = useRotatePassword(
    vek,
    password,
    setDecryptedPassword
  )

  const { handleDeletePassword } = useDeletePassword(password)

  async function handleEdit() {
    if (!vek) return

    try {
      const decrypted = await decrypt(password.password, vek)

      open(ModifyPasswordModal, {
        type: 'update',
        initialData: { ...password, decrypted },
        vek
      })
    } catch {
      toast.error(t('toasts.decryptFailed'))
    }
  }

  return (
    <>
      <Flex align="center" flexShrink="0" gap="xs" ml="2xl" pt="sm">
        <Flex align="end" direction="column" gap="sm" mr="md">
          {decryptedPassword === null ? (
            <Flex
              align="center"
              as="code"
              display={{ base: 'none', md: 'flex' }}
              gap="xs"
              style={{
                fontFamily: 'Arial',
                fontSize: '3rem',
                letterSpacing: '-0.05em',
                userSelect: 'text'
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Box
                  key={i}
                  bg={{ base: 'bg-500', dark: 'bg-100' }}
                  r="full"
                  style={{ width: '0.375rem', height: '0.375rem' }}
                />
              ))}
            </Flex>
          ) : (
            <Box asChild maxWidth="24rem" minWidth="0">
              <Text
                truncate
                as="code"
                display={{ base: 'none', lg: 'block' }}
                size="lg"
                style={{ userSelect: 'text' }}
              >
                {decryptedPassword}
              </Text>
            </Box>
          )}
          <Text
            color={
              dayjs(password.last_password_updated).isBefore(
                dayjs().subtract(3, 'months')
              )
                ? 'red-500'
                : 'muted'
            }
            display={{ base: 'none', md: 'block' }}
            size="sm"
          >
            {t('lastUpdated')}:{' '}
            {dayjs(password.last_password_updated).fromNow()}
          </Text>
        </Flex>
        <Button
          display={{ base: 'none', sm: 'flex' }}
          icon={decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'}
          iconStyle={{ width: '1.5em', height: '1.5em' }}
          loading={loading}
          p="sm"
          variant="plain"
          onClick={onDecrypt}
        />
        <Button
          display={{ base: 'none', sm: 'flex' }}
          icon="tabler:copy"
          loading={copyLoading}
          p="sm"
          variant="plain"
          onClick={() => copyPassword(password.password, decryptedPassword)}
        />
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:rotate"
            label="Rotate Password"
            loading={rotateLoading}
            onClick={rotatePassword}
          />
          <ContextMenuItem
            className="flex sm:hidden"
            icon={decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'}
            label={
              decryptedPassword === null ? 'Show Password' : 'Hide Password'
            }
            loading={loading}
            onClick={onDecrypt}
          />
          <ContextMenuItem
            className="flex sm:hidden"
            icon="tabler:copy"
            label="Copy Password"
            loading={copyLoading}
            onClick={() => copyPassword(password.password, decryptedPassword)}
          />
          <ContextMenuItem
            icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
            label={password.pinned ? 'Unpin' : 'Pin'}
            onClick={() => pinPassword(password.id)}
          />
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleEdit}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeletePassword}
          />
        </ContextMenu>
      </Flex>
      {decryptedPassword !== null && (
        <Box
          as="code"
          bg="bg-800"
          display={{ base: 'block', lg: 'none' }}
          p="md"
          r="md"
          style={{ wordBreak: 'break-all' }}
        >
          {decryptedPassword}
        </Box>
      )}
    </>
  )
}

export default PasswordActions
