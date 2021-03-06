import { Request, Response, NextFunction } from 'express'
import userService from '../services/userService'
import { BadRequest, NotAuthenticated } from '../errors/classes'
import { E_CODES } from '../errors/index'

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      throw new BadRequest(E_CODES.MANDATORY_FIELDS_MISSING)
    }

    const user = await userService.authenticate({ username, password })
    if (!user) throw new NotAuthenticated(E_CODES.INVALID_CREDENTIALS)

    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

export function getAllUsers(req: Request, res: Response, next: NextFunction) {
  const users = userService.getAll()

  res.status(200).json(users)
}
