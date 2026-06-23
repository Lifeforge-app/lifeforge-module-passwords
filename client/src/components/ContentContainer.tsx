import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  EmptyStateScreen,
  FAB,
  Stack,
  WithQuery,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '..'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import ContentHeader from './ContentHeader'
import PasswordEntryItem from './PasswordEntryItem'

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const { t } = useModuleTranslation()
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const [query, setQuery] = useState('')

  const passwordListQuery = useQuery(
    forgeAPI.entries.list.queryOptions({
      enabled: masterPassword !== ''
    })
  )

  const filteredPasswordList = useMemo(() => {
    const passwordList = passwordListQuery.data

    if (!passwordList) return []

    if (query === '') return passwordList

    return passwordList.filter(
      password =>
        password.name.toLowerCase().includes(query.toLowerCase()) ||
        password.website.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, passwordListQuery.data])

  async function pinPassword(id: string) {
    const mapPasswords = (p: PasswordEntry) =>
      p.id === id ? { ...p, pinned: !p.pinned } : p

    const sortPasswords = (a: PasswordEntry, b: PasswordEntry) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      return 0
    }

    try {
      await forgeAPI.entries.togglePin.input({ id }).mutate(undefined)

      queryClient.setQueryData<PasswordEntry[]>(
        ['passwords', 'entries'],
        prev => {
          if (!prev) return prev

          return prev.map(mapPasswords).sort(sortPasswords)
        }
      )
    } catch {
      toast.error(t('error.pin'))
      queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
    }
  }

  const handleCreatePassword = useCallback(() => {
    open(ModifyPasswordModal, {
      type: 'create',
      masterPassword
    })
  }, [])

  return (
    <>
      <ContentHeader
        handleCreatePassword={handleCreatePassword}
        masterPassword={masterPassword}
        query={query}
        setQuery={setQuery}
      />
      <WithQuery query={passwordListQuery}>
        {() =>
          filteredPasswordList.length === 0 ? (
            <EmptyStateScreen
              icon="tabler:key-off"
              message={{
                id: passwordListQuery.data?.length ? 'search' : 'passwords'
              }}
            />
          ) : (
            <Stack gap="sm" mb="xl" mt="md" width="100%">
              {filteredPasswordList.map(password => (
                <PasswordEntryItem
                  key={password.id}
                  masterPassword={masterPassword}
                  password={password}
                  pinPassword={pinPassword}
                />
              ))}
            </Stack>
          )
        }
      </WithQuery>
      <FAB visibilityBreakpoint="lg" onClick={handleCreatePassword} />
    </>
  )
}

export default ContentContainer
