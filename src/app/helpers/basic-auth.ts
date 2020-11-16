import userService from '../services/userService'
import { NotAuthenticated } from '../errors/classes'
import { E_CODES } from '../errors/index'

async function basicAuth(req: any, res: any, next: any) {
  try {
    // make authenticate path public
    if (req.path === '/api/users/authenticate') {
      return next()
    }

    // check for basic auth header
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf('Basic ') === -1
    ) {
      throw new NotAuthenticated(E_CODES.MISSING_AUTHORIZATION_HEADER)
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    )
    const [username, password] = credentials.split(':')
    const user = await userService.authenticate({ username, password })
    if (!user) throw new NotAuthenticated(E_CODES.INVALID_CREDENTIALS)
    // attach user to request object
    req.user = user

    next()
  } catch (e) {
    next(e)
  }
}

export default basicAuth
