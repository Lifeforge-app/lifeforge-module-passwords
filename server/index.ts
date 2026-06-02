import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'
import * as masterRoutes from './routes/master'

const routes = forgeRouter({
  master: masterRoutes,
  entries: entriesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
