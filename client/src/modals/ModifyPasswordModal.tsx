import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { encrypt } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '..'

const schema = z.object({
  icon: z.string().min(1, 'Required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color'),
  website: z.string().min(1, 'Required'),
  username: z.string().optional().default('').catch(''),
  password: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  master: z.string().optional().catch('')
})

function ModifyPasswordModal({
  data: { type, initialData, masterPassword },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: PasswordEntry & {
      decrypted?: string
    }
    masterPassword: string
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.entries.create
      : forgeAPI.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['passwords', 'entries']
        })
      },
      onError: () => {
        toast.error('Failed to modify password entry')
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      icon: initialData?.icon || 'tabler:lock',
      color: initialData?.color || '#000000',
      website: initialData?.website || '',
      username: initialData?.username || '',
      password: initialData?.decrypted || '',
      master: ''
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          const challenge = await forgeAPI.entries.getChallenge.query()

          const encryptedMaster = encrypt(masterPassword, challenge)

          const encryptedPassword = encrypt(data.password, challenge)

          await mutation.mutateAsync({
            ...data,
            username: data.username || '',
            password: encryptedPassword,
            master: encryptedMaster
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.passwords',
        title: `password.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:lock"
        label="serviceName"
        name="name"
        placeholder="My Service"
      />
      <IconField
        required
        control={form.control}
        label="serviceIcon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="serviceColor"
        name="color"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:link"
        label="website"
        name="website"
        placeholder="https://example.com"
      />
      <TextField
        control={form.control}
        icon="tabler:user"
        label="usernameOrEmail"
        name="username"
        placeholder="johndoe1234"
      />
      <TextField
        required
        actionButtonProps={{
          icon: 'tabler:dice',
          onClick: () => {
            const alphabets = 'abcdefghijklmnopqrstuvwxyz'

            const ALPHABETS = alphabets.toUpperCase()

            const numbers = '0123456789'

            const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'

            const allCharacters = `${alphabets}${ALPHABETS}${numbers}${symbols}`

            const passwordLength = 16

            let generatedPassword = ''

            for (let i = 0; i < passwordLength; i++) {
              const randomIndex = Math.floor(
                Math.random() * allCharacters.length
              )

              generatedPassword += allCharacters[randomIndex]
            }

            form.setValue('password', generatedPassword, {
              shouldValidate: true
            })

            copy(generatedPassword)
            toast.success('Password copied to clipboard')
          }
        }}
        control={form.control}
        icon="tabler:key"
        label="password"
        name="password"
        placeholder="Your password"
      />
    </FormModal>
  )
}

export default ModifyPasswordModal
