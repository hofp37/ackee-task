// Assure code is same as key in the object
const checkErrors = <
  T extends { [X in keyof T]: { code: X; message: string } }
>(
  errors: T
) => errors

export const E_CODES = checkErrors({
  UNKNOWN: { code: 'UNKNOWN', message: 'Unknown error' },
  MANDATORY_FIELDS_MISSING: {
    code: 'MANDATORY_FIELDS_MISSING',
    message: 'Please enter all mandatory fields',
  },
  INCORRECT_TYPE_PROVIDED: {
    code: 'INCORRECT_TYPE_PROVIDED',
    message: 'Incorrect type provided, see docs for details',
  },
  DUPLICATION_ERROR_PROBLEM: {
    code: 'DUPLICATION_ERROR_PROBLEM',
    message: 'Problem already exists',
  },
  INTERNAL_SERVER_ERROR_CREATE_PROBLEM: {
    code: 'INTERNAL_SERVER_ERROR_CREATE_PROBLEM',
    message: 'Something went wrong while saving the problem',
  },
  NOT_FOUND_PROBLEM: {
    code: 'NOT_FOUND_PROBLEM',
    message: 'Provided problem ID does not exist',
  },
  INTERNAL_SERVER_ERROR_DELETE_PROBLEM: {
    code: 'INTERNAL_SERVER_ERROR_DELETE_PROBLEM',
    message: 'Something went wrong while deleting the problem',
  },
  INTERNAL_SERVER_ERROR_GET_PROBLEM_LIST: {
    code: 'INTERNAL_SERVER_ERROR_GET_PROBLEM_LIST',
    message: 'Something went wrong while getting the problem list',
  },
  INTERNAL_SERVER_ERROR_UPDATE_PROBLEM: {
    code: 'INTERNAL_SERVER_ERROR_UPDATE_PROBLEM',
    message: 'Something went wrong while updating the problem',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials',
  },
  MISSING_AUTHORIZATION_HEADER: {
    code: 'MISSING_AUTHORIZATION_HEADER',
    message: 'Missing authorization header',
  },
  INSUFFICIENT_RIGHTS: {
    code: 'INSUFFICIENT_RIGHTS',
    message: 'Insufficient rights to perfom this action',
  },
  ID_NOT_VALID: {
    code: 'ID_NOT_VALID',
    message:
      'Problem ID passed in must be a single String of 12 bytes or a string of 24 hex characters',
  },
} as const)
