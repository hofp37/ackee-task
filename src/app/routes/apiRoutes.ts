import { createRouter } from 'unicore'

import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'
import basicAuth from '../helpers/basic-auth'
import errorHandler from '../helpers/error-handler'
import { authenticate, getAll } from '../controllers/usersController'

const router = createRouter()

router.all('/hello', baseController(hello))

router.post('/users/authenticate', authenticate)

router.get('/users', basicAuth, getAll)

router.use(errorHandler)

export default router
