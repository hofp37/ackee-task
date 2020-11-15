import { createRouter } from 'unicore'

import { baseController } from '../controllers/api/genericControllers'
import { hello } from '../services/helloService'
import basicAuth from '../helpers/basic-auth'
import { authenticate, getAllUsers } from '../controllers/usersController'
import {
  createProblem,
  getProblem,
  getProblemList,
  updateProblem,
  deleteProblem,
} from '../controllers/problemsController'

const apiProblemIdPath = '/problems/:problemId'

const router = createRouter()

router.all('/hello', baseController(hello))

router.post('/users/authenticate', authenticate)
router.get('/users', basicAuth, getAllUsers)

router.post('/problems', basicAuth, createProblem)
router.get(apiProblemIdPath, basicAuth, getProblem)
router.get('/problems', basicAuth, getProblemList)
router.put(apiProblemIdPath, basicAuth, updateProblem)
router.delete(apiProblemIdPath, basicAuth, deleteProblem)

export default router
