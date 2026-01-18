import { forgeRouter } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'
import * as masterRoutes from './routes/master'

export default forgeRouter({
  master: masterRoutes,
  entries: entriesRoutes
})
