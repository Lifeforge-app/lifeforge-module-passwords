import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Passwords',
  icon: 'tabler:key',
  routes: {
    '/': lazy(() => import('@'))
  },
  category: 'Confidential'
} satisfies ModuleConfig
