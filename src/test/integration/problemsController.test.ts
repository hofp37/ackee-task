import * as request from 'supertest-as-promised'
import { E_CODES } from '../../app/errors/index'
import app from '../../server'

describe('ProblemsController - workflow', () => {

    let problem: any

    it('should create a new problem', async () => {
        const input = {
            value: 'This is riddle',
            type: 'riddle'
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                const { value, type, ...rest } = body
                expect(value).toEqual(input.value)
                expect(type).toEqual(input.type)
                problem = body
            })
    })

    it('should return duplication error', async () => {
        const input = {
            value: problem.value,
            type: problem.type
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.DUPLICATION_ERROR_PROBLEM.message)
            })
    })

    it('should get all riddle problems and find the created one', async () => {
        const filter = 'riddle'

        return await request(app)
            .get(`/api/problems?type=${filter}`)
            .auth('test', 'test')
            .expect(200)
            .then(({ body }: any) => {
                const foundProblem = body.find((el: any) => el._id === problem._id)
                const isFiltered = body.every((el: any) => el.type === filter)
                expect(body).toBeArray()
                expect(isFiltered).toBe(true)
                expect(foundProblem.value).toEqual(problem.value)
                expect(foundProblem.type).toEqual(problem.type)
                expect(foundProblem.createdBy).toEqual(problem.createdBy)
                expect(foundProblem.__v).toEqual(problem.__v)
            })
    })

    it('should get the created problem by id', async () => {
        return await request(app)
            .get(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)
            .then(({ body }: any) => {
                const { value, type, ...rest } = body
                expect(rest._id).toEqual(problem._id)
                expect(value).toEqual(problem.value)
                expect(type).toEqual(problem.type)
                expect(rest.createdBy).toEqual(problem.createdBy)
                expect(rest.__v).toEqual(problem.__v)
            })
    })

    it('should update the problem', async () => {
        const input = {
            value: '1- (10/5)* 2 +72233',
            type: 'expression'
        }
        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                const { value, type, ...rest } = body
                expect(rest._id).toEqual(problem._id)
                expect(value).toEqual(input.value)
                expect(type).toEqual(input.type)
                expect(rest.createdBy).toEqual(problem.createdBy)
                expect(rest.__v).toEqual(problem.__v)
                problem = body
            })
    })

    it('should delete the problem', async () => {
        return await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)
            .then(({ body }: any) => {
                const { msg } = body
                expect(msg).toEqual('Problem was removed')
            })
    })

    it('should not find previously deleted problem by id', async () => {
        return await request(app)
            .get(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(404)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.NOT_FOUND_PROBLEM.message)
            })
    })
})

describe('ProblemsController - Auth errors', () => {
    it('should return missing auth header', async () => {
        const input = {
            value: 'test',
            type: 'riddle'
        }
        return await request(app)
            .post('/api/problems')
            .send(input)
            .expect(401)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.MISSING_AUTHORIZATION_HEADER.message)
            })
    })

    it('should return invalid credentials', async () => {
        const input = {
            value: 'test',
            type: 'riddle'
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'incorrectpassword')
            .send(input)
            .expect(401)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INVALID_CREDENTIALS.message)
            })
    })
})

describe('ProblemsController - POST validation errors', () => {
    it('should return mandatory fields missing', async () => {
        const input = {
            value: 'test'
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.MANDATORY_FIELDS_MISSING.message)
            })
    })

    it('should return incorrect type provided', async () => {
        const input = {
            value: 'test',
            type: 'incorrect'
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INCORRECT_TYPE_PROVIDED.message)
            })
    })

    it('should return invalid value for expression type', async () => {
        const input = {
            value: 'test',
            type: 'expression'
        }
        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.VALUE_NOT_VALID_EXPRESSION.message)
            })
    })
})

describe('ProblemsController - GET validation errors', () => {
    it('should return id not valid', async () => {
        return await request(app)
            .get('/api/problems/343dd')
            .auth('test', 'test')
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.ID_NOT_VALID.message)
            })
    })

    it('should return problem not found', async () => {
        const input = {
            value: 'problem test riddle',
            type: 'riddle'
        }
        let problem: any

        await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                problem = body
            })

        await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)

        return await request(app)
            .get(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(404)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.NOT_FOUND_PROBLEM.message)
            })
    })
})

describe('ProblemsController - PUT validation errors', () => {
    let problem: any

    it('should create a problem', async () => {
        const input = {
            value: 'problem riddle',
            type: 'riddle'
        }

        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                problem = body
            })
    })

    it('should return problem id not valid', async () => {
        const inputUpdate = {
            value: 'problem value update',
            type: 'riddle'
        }

        return await request(app)
            .put('/api/problems/343dd')
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.ID_NOT_VALID.message)
            })
    })

    it('should return mandatory fields missing', async () => {
        const inputUpdate = {
            type: 'riddle'
        }

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.MANDATORY_FIELDS_MISSING.message)
            })
    })

    it('should return incorrect type provided', async () => {
        const inputUpdate = {
            value: 'problem test',
            type: 'incorrect'
        }

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INCORRECT_TYPE_PROVIDED.message)
            })
    })

    it('should return invalid value for type expression', async () => {
        const inputUpdate = {
            value: 'problem test',
            type: 'expression'
        }

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.VALUE_NOT_VALID_EXPRESSION.message)
            })
    })

    it('should return duplication error', async () => {
        const inputUpdate = {
            value: 'problem riddle',
            type: 'riddle'
        }

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.DUPLICATION_ERROR_PROBLEM.message)
            })
    })

    it('should return problem not found', async () => {
        const inputUpdate = {
            value: 'problem riddle 2',
            type: 'riddle'
        }

        await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .send(inputUpdate)
            .expect(404)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.NOT_FOUND_PROBLEM.message)
            })
    })
})

describe('ProblemsController - DELETE validation errors', () => {
    let problem: any

    it('should create a problem', async () => {
        const input = {
            value: 'problem riddle',
            type: 'riddle'
        }

        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                problem = body
            })
    })

    it('should return problem id not valid', async () => {
        return await request(app)
            .delete('/api/problems/343dd')
            .auth('test', 'test')
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.ID_NOT_VALID.message)
            })
    })

    it('should return problem not found', async () => {
        await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)

        return await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(404)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.NOT_FOUND_PROBLEM.message)
            })
    })
})

describe('ProblemsController - INSUFFICIENT RIGHTS errors', () => {
    let problem: any

    it('should create a problem', async () => {
        const input = {
            value: 'problem riddle',
            type: 'riddle'
        }

        return await request(app)
            .post('/api/problems')
            .auth('test', 'test')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                problem = body
            })
    })

    it('should return insufficient rights PUT method with different user', async () => {
        const inputUpdate = {
            value: 'problem riddle 2',
            type: 'riddle'
        }

        return await request(app)
            .put(`/api/problems/${problem._id}`)
            .auth('patrik', 'patrik')
            .send(inputUpdate)
            .expect(403)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INSUFFICIENT_RIGHTS.message)
            })
    })

    it('should return insufficient rights DELETE method with different user', async () => {
        return await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('patrik', 'patrik')
            .expect(403)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INSUFFICIENT_RIGHTS.message)
            })
    })

    it('should delete the problem by owner', async () => {
        return await request(app)
            .delete(`/api/problems/${problem._id}`)
            .auth('test', 'test')
            .expect(200)
            .then(({ body }: any) => {
                const { msg } = body
                expect(msg).toBe('Problem was removed')
            })
    })
})