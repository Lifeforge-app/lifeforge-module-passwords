import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  SearchInput,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { encrypt } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import type { PasswordEntry } from '..'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import PasswordEntryItem from './PasswordEntryItem'

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const queryClient = useQueryClient()

  const { open } = useModalStore()

  const { t } = useTranslation('apps.passwords')

  const [query, setQuery] = useState('')

  const passwordListQuery = useQuery(
    forgeAPI.entries.list.queryOptions({
      enabled: masterPassword !== ''
    })
  )

  const filteredPasswordList = useMemo(() => {
    const passwordList = passwordListQuery.data

    if (!passwordList) {
      return []
    }

    if (query === '') {
      return passwordList
    }

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
      await forgeAPI.entries.togglePin.input({ id }).mutate({})

      queryClient.setQueryData<PasswordEntry[]>(
        ['passwords', 'entries'],
        prev => {
          if (!prev) return prev

          return prev.map(mapPasswords).sort(sortPasswords)
        }
      )
    } catch {
      toast.error(t('error.pin'))
      queryClient.invalidateQueries({
        queryKey: ['passwords', 'entries']
      })
    }
  }

  const handleCreatePassword = useCallback(() => {
    open(ModifyPasswordModal, {
      type: 'create',
      masterPassword
    })
  }, [])

  const handleExport = useCallback(async () => {
    try {
      const challenge = await forgeAPI.entries.getChallenge.query()

      if (!challenge) {
        toast.error('Failed to export passwords')

        return
      }

      const entries = await forgeAPI.entries.exportEntries.mutate({
        master: encrypt(masterPassword, challenge)
      })

      const headers = [
        'Name',
        'Username',
        'Password',
        'Website',
        'Last Modified'
      ]

      const csvContent = [
        headers.join(','),
        ...entries.map((row: PasswordEntry) =>
          [row.name, row.username, row.password, row.website, row.updated]
            .map(field => `"${(field || '').replace(/"/g, '""')}"`)
            .join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      const link = document.createElement('a')

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', 'passwords_export.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to export passwords')
    }
  }, [masterPassword])

  return (
    <>
      <ModuleHeader
        actionButton={
          masterPassword !== '' && (
            <div className="flex gap-2">
              <Button
                className="hidden lg:flex"
                icon="tabler:plus"
                tProps={{ item: t('items.password') }}
                onClick={handleCreatePassword}
              >
                new
              </Button>
            </div>
          )
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:file-export"
                label="exportToCsv"
                namespace="apps.passwords"
                onClick={handleExport}
              />
            </>
          )
        }}
      />
      <SearchInput
        debounceMs={300}
        namespace="apps.passwords"
        searchTarget="password"
        value={query}
        onChange={setQuery}
      />
      <WithQuery query={passwordListQuery}>
        {() =>
          filteredPasswordList.length === 0 ? (
            <EmptyStateScreen
              icon="tabler:key-off"
              message={{
                id: passwordListQuery.data?.length ? 'search' : 'passwords',
                namespace: 'apps.passwords'
              }}
            />
          ) : (
            <div className="my-8 flex w-full flex-col gap-3">
              {filteredPasswordList.map(password => (
                <PasswordEntryItem
                  key={password.id}
                  masterPassword={masterPassword}
                  password={password}
                  pinPassword={pinPassword}
                />
              ))}
            </div>
          )
        }
      </WithQuery>
      <FAB visibilityBreakpoint="lg" onClick={handleCreatePassword} />
    </>
  )
}

export default ContentContainer
