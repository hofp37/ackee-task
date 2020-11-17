import Problem from '../models/problem'
import config from '../../config/config'
import { BadRequest, ServerError, NotFound } from '../errors/classes'
import { E_CODES } from '../errors/index'
import * as mongoose from 'mongoose'

async function createProblem(inputData: object) {
  const newProblem = new Problem(inputData)
  const saved = await newProblem.save()
  if (!saved) {
    throw new ServerError(E_CODES.INTERNAL_SERVER_ERROR_CREATE_PROBLEM)
  }
  return saved
}

async function checkDuplication(value: string) {
  const problem = await Problem.findOne({ value })
  if (problem) return problem
}

async function getProblemById(problemId: string) {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new BadRequest(E_CODES.ID_NOT_VALID)
  }

  const problem = await Problem.findById(problemId)
  if (!problem) throw new NotFound(E_CODES.NOT_FOUND_PROBLEM)
  return problem
}

async function getProblemList(filter: object) {
  const problemList = await Problem.find(filter)
  if (!problemList) {
    throw new ServerError(E_CODES.INTERNAL_SERVER_ERROR_GET_PROBLEM_LIST)
  }
  return problemList
}

async function updateProblem(problemId: string, inputData: object) {
  const updated = await Problem.findByIdAndUpdate(problemId, inputData, {
    new: true,
  })
  if (!updated) {
    throw new ServerError(E_CODES.INTERNAL_SERVER_ERROR_UPDATE_PROBLEM)
  }
  return updated
}

async function deleteProblem(problem: any) {
  const removed = await problem.remove()
  if (!removed) {
    throw new ServerError(E_CODES.INTERNAL_SERVER_ERROR_DELETE_PROBLEM)
  }
  return removed
}

interface RequestBodyType {
  value?: string
  type?: string
}

async function validateRequestBody(requestBody: RequestBodyType) {
  const { value, type } = requestBody

  if (!value || !type) {
    throw new BadRequest(E_CODES.MANDATORY_FIELDS_MISSING)
  }

  if (!config.types.valid.includes(type.toLowerCase())) {
    throw new BadRequest(E_CODES.INCORRECT_TYPE_PROVIDED)
  }

  if (
    type === config.types.expression &&
    value.match(/(^[\d ( +-]).*([\d )$])/) === null
  ) {
    throw new BadRequest(E_CODES.VALUE_NOT_VALID_EXPRESSION)
  }

  const problemFound = await checkDuplication(value)
  if (problemFound) throw new BadRequest(E_CODES.DUPLICATION_ERROR_PROBLEM)
}

export default {
  createProblem,
  checkDuplication,
  getProblemById,
  getProblemList,
  updateProblem,
  deleteProblem,
  validateRequestBody,
}
