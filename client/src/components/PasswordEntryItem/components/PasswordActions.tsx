import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useState } from 'react'

import { encrypt, usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Text,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifyPasswordModal from '@/modals/ModifyPasswordModal'
import { getDecryptedPassword } from '@/utils/getDecryptedPassword'

import type { PasswordEntry } from '../../..'

dayjs.extend(relativeTime)

function PasswordActions({
  masterPassword,
  password,
  pinPassword,
  t
}: {
  masterPassword: string
  password: PasswordEntry
  pinPassword: (id: string) => Promise<void>
  t: (key: string) => string
}) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const [copyLoading, setCopyLoading] = useState(false)
  const [rotateLoading, setRotateLoading] = useState(false)

  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )

  const deleteMutation = useMutation(
    forgeAPI.entries.remove.input({ id: password.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
      },
      onError: () => {
        toast.error('Failed to delete password. Please try again.')
      }
    })
  )

  async function copyPassword() {
    setCopyLoading(true)

    if (decryptedPassword !== null) {
      copy(decryptedPassword)
      toast.success('Password copied!')
    } else {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      copy(decrypted)
      toast.success('Password copied!')
    }
    setCopyLoading(false)
  }

  async function handleEdit() {
    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      open(ModifyPasswordModal, {
        type: 'update',
        initialData: { ...password, decrypted },
        masterPassword
      })
    } catch {
      toast.error("Couldn't fetch the password. Please try again.")
    }
  }

  const decryptPassword = useCallback(async () => {
    if (decryptedPassword !== null) {
      setDecryptedPassword(null)

      return
    }

    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      setDecryptedPassword(decrypted)
    } catch {
      toast.error("Couldn't decrypt the password. Please try again.")
      setDecryptedPassword(null)
    }
  }, [masterPassword, password.id, decryptedPassword])

  const [loading, onDecrypt] = usePromiseLoading(decryptPassword)

  const handleDeletePassword = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Password',
      description: `Are you sure you want to delete the password for ${password.name}? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: () => deleteMutation.mutateAsync(undefined)
    })
  }, [password])

  const rotatePassword = useCallback(async () => {
    setRotateLoading(true)
    const alphabets = 'abcdefghijklmnopqrstuvwxyz'
    const ALPHABETS = alphabets.toUpperCase()
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'
    const allCharacters = `${alphabets}${ALPHABETS}${numbers}${symbols}`

    let generatedPassword = ''

    for (let i = 0; i < 16; i++) {
      generatedPassword +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)]
    }

    const challenge = await forgeAPI.entries.getChallenge.query()
    const encryptedMaster = encrypt(masterPassword, challenge)
    const encryptedPassword = encrypt(generatedPassword, challenge)

    await forgeAPI.entries.update.input({ id: password.id }).mutate({
      ...password,
      password: encryptedPassword,
      master: encryptedMaster
    })

    copy(generatedPassword)
    toast.success('Password copied to clipboard')
    setRotateLoading(false)
    queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
    setDecryptedPassword(generatedPassword)
  }, [masterPassword, password])

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
            dayjs(password.updated).isBefore(dayjs().subtract(3, 'months'))
              ? 'red-500'
              : 'muted'
          }
          display={{ base: 'none', md: 'block' }}
          size="sm"
        >
          {t('lastUpdated')}: {dayjs(password.updated).fromNow()}
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
        onClick={copyPassword}
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
          label={decryptedPassword === null ? 'Show Password' : 'Hide Password'}
          loading={loading}
          onClick={onDecrypt}
        />
        <ContextMenuItem
          className="flex sm:hidden"
          icon="tabler:copy"
          label="Copy Password"
          loading={copyLoading}
          onClick={copyPassword}
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
