import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'
import { encrypt } from 'shared'

import type { PasswordEntry } from '..'

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
      ? forgeAPI.passwords.entries.create
      : forgeAPI.passwords.entries.update.input({
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

  const { formProps, formStateStore } = defineForm<
    InferInput<(typeof forgeAPI.passwords.entries)[typeof type]>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    namespace: 'apps.passwords',
    title: `password.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      icon: 'icon',
      color: 'color',
      website: 'text',
      username: 'text',
      password: 'text',
      name: 'text',
      master: 'text'
    })
    .setupFields({
      name: {
        label: 'serviceName',
        icon: 'tabler:lock',
        placeholder: 'My Service',
        required: true
      },
      icon: {
        label: 'serviceIcon',
        required: true
      },
      color: {
        label: 'serviceColor',
        required: true
      },
      website: {
        label: 'website',
        icon: 'tabler:link',
        placeholder: 'https://example.com',
        required: true
      },
      username: {
        label: 'usernameOrEmail',
        icon: 'tabler:user',
        placeholder: 'johndoe1234'
      },
      password: {
        label: 'password',
        icon: 'tabler:key',
        placeholder: 'Your password',
        required: true,
        isPassword: true,
        actionButtonProps: {
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

            formStateStore.setState({
              password: generatedPassword
            })

            copy(generatedPassword)
            toast.success('Password copied to clipboard')
          }
        }
      }
    })
    .initialData({
      name: initialData?.name || '',
      icon: initialData?.icon || 'tabler:lock',
      color: initialData?.color || '#000000',
      website: initialData?.website || '',
      username: initialData?.username || '',
      password: initialData?.decrypted || '',
      master: ''
    })
    .onSubmit(async data => {
      const challenge = await forgeAPI.passwords.entries.getChallenge.query()

      const encryptedMaster = encrypt(masterPassword, challenge)

      const encryptedPassword = encrypt(data.password, challenge)

      await mutation.mutateAsync({
        ...data,
        password: encryptedPassword,
        master: encryptedMaster
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyPasswordModal
