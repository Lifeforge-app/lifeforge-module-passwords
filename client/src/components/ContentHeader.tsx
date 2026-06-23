import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { encrypt } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenuItem,
  Flex,
  ModuleHeader,
  SearchInput,
  TagsFilter,
  toast,
  useModuleSidebarState
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '..'
import useFilter from '../hooks/useFilter'

function ContentHeader({
  masterPassword,
  query,
  setQuery,
  handleCreatePassword
}: {
  masterPassword: string
  query: string
  setQuery: (val: string) => void
  handleCreatePassword: () => void
}) {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const { filter, updateFilter } = useFilter()

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
          [
            row.name,
            row.username,
            row.password,
            row.website,
            row.last_password_updated
          ]
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
            <Flex gap="sm">
              <Button
                display={{ base: 'none', lg: 'flex' }}
                icon="tabler:plus"
                tProps={{ item: t('items.password') }}
                onClick={handleCreatePassword}
              >
                new
              </Button>
            </Flex>
          )
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:file-export"
                label="exportToCsv"
                onClick={handleExport}
              />
            </>
          )
        }}
      />
      <TagsFilter
        availableFilters={{
          category: {
            data:
              categoriesQuery.data?.map(category => ({
                id: category.id,
                icon: category.icon,
                color: category.color,
                label: category.name
              })) || [],
            isColored: true
          }
        }}
        values={{
          category: filter.category
        }}
        onChange={{
          category: value => {
            updateFilter('category', value)
          }
        }}
      />
      <Flex align="center" gap="md" mb="md">
        <SearchInput
          debounceMs={300}
          searchTarget="password"
          value={query}
          onChange={setQuery}
        />
        <Button
          display={{ base: 'flex', lg: 'none' }}
          icon="tabler:category"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
    </>
  )
}

export default ContentHeader
