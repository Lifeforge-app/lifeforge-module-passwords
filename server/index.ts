import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as categoriesRoutes from './routes/categories'
import * as entriesRoutes from './routes/entries'
import * as masterRoutes from './routes/master'

const routes = forgeRouter({
  master: masterRoutes,
  entries: entriesRoutes,
  categories: categoriesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
