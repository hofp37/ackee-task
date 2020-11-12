import userService from '../services/userService'

export function authenticate(req: any, res: any, next: any) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: 'Username or password is incorrect' })
    )
    .catch(err => next(err))
}

export function getAll(req: any, res: any, next: any) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err))
}
