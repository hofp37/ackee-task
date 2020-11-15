import problemService from '../services/problemService'
import { NotAuthorized } from '../errors/classes'
import { E_CODES } from '../errors/index'

export async function createProblem(req: any, res: any, next: any) {
  try {
    const { value, type } = req.body
    const createdBy = req.user.id

    await problemService.validateRequestBody(req.body)

    const newProblem = {
      value,
      type,
      createdBy,
    }

    const problem = await problemService.createProblem(newProblem)

    res.status(200).json(problem)
  } catch (e) {
    next(e)
  }
}

export async function getProblem(req: any, res: any, next: any) {
  try {
    const problem = await problemService.getProblemById(req.params.problemId)

    res.status(200).json(problem)
  } catch (e) {
    next(e)
  }
}

export async function getProblemList(req: any, res: any, next: any) {
  try {
    const { type } = req.query
    const filter = type ? { type } : {}

    const problemList = await problemService.getProblemList(filter)

    res.status(200).json(problemList)
  } catch (e) {
    next(e)
  }
}

export async function updateProblem(req: any, res: any, next: any) {
  try {
    const { value, type } = req.body

    const problem = await problemService.getProblemById(req.params.problemId)

    if (req.user.id !== problem.toObject().createdBy) {
      throw new NotAuthorized(E_CODES.INSUFFICIENT_RIGHTS)
    }

    await problemService.validateRequestBody(req.body)

    const updated = await problemService.updateProblem(req.params.problemId, {
      value,
      type,
    })

    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}

export async function deleteProblem(req: any, res: any, next: any) {
  try {
    const problem = await problemService.getProblemById(req.params.problemId)

    if (req.user.id !== problem.toObject().createdBy) {
      throw next(new NotAuthorized(E_CODES.INSUFFICIENT_RIGHTS))
    }

    await problemService.deleteProblem(problem)

    res.status(200).json({ msg: 'Problem was removed' })
  } catch (e) {
    next(e)
  }
}
