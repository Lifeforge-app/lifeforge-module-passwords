import type { PasswordEntry } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  ColorField,
  FormModal,
  IconField,
  ListboxField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { encrypt } from '@/utils/crypto'

const schema = z.object({
  icon: z.string().min(1, 'Required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color'),
  website: z.string().min(1, 'Required'),
  username: z.string().optional().default('').catch(''),
  password: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  category: z.string().optional()
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
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.entries.create
      : forgeAPI.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.entries.list.key
        })
        queryClient.invalidateQueries({
          queryKey: forgeAPI.categories.list.key
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
      category: initialData?.category || ''
    },
    resolver: zodResolver(schema)
  })

  const categoryOptions = (categoriesQuery.data || []).map(category => ({
    text: category.name,
    color: category.color,
    icon: category.icon,
    value: category.id
  }))

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          const encryptedPassword = await encrypt(
            data.password,
            masterPassword
          )

          await mutation.mutateAsync({
            ...data,
            username: data.username || '',
            category: data.category ?? '',
            password: encryptedPassword
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        loading: categoriesQuery.isLoading,
        namespace: 'apps.passwords',
        title: `password.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:lock"
        label="password.serviceName"
        name="name"
        placeholder="My Service"
      />
      <IconField
        required
        control={form.control}
        label="password.serviceIcon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="password.serviceColor"
        name="color"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:link"
        label="password.website"
        name="website"
        placeholder="https://example.com"
      />
      <TextField
        control={form.control}
        icon="tabler:user"
        label="password.usernameOrEmail"
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
        label="password.password"
        name="password"
        placeholder="Your password"
      />
      <ListboxField
        control={form.control}
        icon="tabler:category"
        label="password.category"
        name="category"
        options={categoryOptions}
      />
    </FormModal>
  )
}

export default ModifyPasswordModal
