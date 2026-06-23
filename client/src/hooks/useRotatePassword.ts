import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import { useCallback, useState } from 'react'

import { ConfirmationModal, toast, useModalStore } from '@lifeforge/ui'
import { useModuleTranslation } from '@lifeforge/localization'

import { forgeAPI } from '@/manifest'
import { encrypt } from '@/utils/crypto'

import type { PasswordEntry } from '..'

const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz'
const ALPHABETS_UPPER = ALPHABETS.toUpperCase()
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?'
const ALL_CHARACTERS = `${ALPHABETS}${ALPHABETS_UPPER}${NUMBERS}${SYMBOLS}`
const PASSWORD_LENGTH = 16

function generatePassword(): string {
  let password = ''

  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    password +=
      ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)]
  }

  return password
}

export default function useRotatePassword(
  vek: CryptoKey | null,
  password: PasswordEntry,
  setDecryptedPassword: (val: string) => void
) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const [rotateLoading, setRotateLoading] = useState(false)

  const rotateMutation = useMutation(
    forgeAPI.entries.update.input({ id: password.id }).mutationOptions()
  )

  const doRotate = useCallback(async () => {
    if (!vek) return

    setRotateLoading(true)
    const generatedPassword = generatePassword()

    const encryptedPassword = await encrypt(generatedPassword, vek)

    await rotateMutation.mutateAsync({
      ...password,
      password: encryptedPassword,
      password_changed: true
    })

    copy(generatedPassword)
    toast.success(t('toasts.passwordCopied'))
    setRotateLoading(false)
    queryClient.invalidateQueries({ queryKey: forgeAPI.entries.list.key })
    setDecryptedPassword(generatedPassword)
  }, [vek, password, rotateMutation, queryClient, setDecryptedPassword])

  const rotatePassword = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Rotate Password',
      description: `Are you sure you want to rotate the password for ${password.name}? The new password will be copied to your clipboard.`,
      confirmButton: 'Rotate',
      onConfirm: doRotate
    })
  }, [password, doRotate, open])

  return { rotatePassword, rotateLoading }
}
