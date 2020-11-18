import problemService from '../../app/services/problemService'
import { E_CODES } from '../../app/errors/index'

describe('problemService', () => {
    test('validateRequestBody - incorrect type provided', () => {
        const input = {
            value: 'test',
            type: 'test'
        }
        const error = {
            errorCode: E_CODES.INCORRECT_TYPE_PROVIDED.code,
            errorData: undefined,
            name: "BadRequest",
            status: 400,
        }

        expect(problemService.validateRequestBody(input)).rejects.toMatchObject(error)
    })

    test('validateRequestBody - mandatory fields missing', () => {
        const input = {
            value: 'test'
        }
        const error = {
            errorCode: E_CODES.MANDATORY_FIELDS_MISSING.code,
            errorData: undefined,
            name: "BadRequest",
            status: 400,
        }

        expect(problemService.validateRequestBody(input)).rejects.toMatchObject(error)
    })

    test('validateRequestBody - value not valid for expression type', () => {
        const input = {
            value: 'test',
            type: 'expression'
        }
        const error = {
            errorCode: E_CODES.VALUE_NOT_VALID_EXPRESSION.code,
            errorData: undefined,
            name: "BadRequest",
            status: 400,
        }

        expect(problemService.validateRequestBody(input)).rejects.toMatchObject(error)
    })
})