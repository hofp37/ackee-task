import * as request from 'supertest-as-promised'
import { E_CODES } from '../../app/errors/index'
import app from '../../server'

describe('UsersController - POST users authenticate', () => {
    it('should auth existing user', async () => {
        const input = {
            username: 'test',
            password: 'test'
        }
        const expected = {
            id: 1,
            username: 'test',
            firstName: 'Test',
            lastName: 'User'
        }
        return await request(app)
            .post('/api/users/authenticate')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                expect(body).toEqual(expected)
            })
    })

    it('should return mandatory fields missing', async () => {
        const input = {
            username: 'test'
        }
        return await request(app)
            .post('/api/users/authenticate')
            .send(input)
            .expect(400)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.MANDATORY_FIELDS_MISSING.message)
            })
    })

    it('should return invalid credentials', async () => {
        const input = {
            username: 'test',
            password: 'incorrect'
        }
        return await request(app)
            .post('/api/users/authenticate')
            .send(input)
            .expect(401)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INVALID_CREDENTIALS.message)
            })
    })
})

describe('UsersController - GET users list', () => {
    it('should get list of existing users', async () => {
        const expected = [
            {
                id: 1,
                username: 'test',
                firstName: 'Test',
                lastName: 'User'
            },
            {
                id: 2,
                username: 'patrik',
                firstName: 'Test',
                lastName: 'User'
            }
        ]
        return await request(app)
            .get('/api/users')
            .auth('test', 'test')
            .expect(200)
            .then(({ body }: any) => {
                expect(body).toEqual(expected)
            })
    })

    it('should return auth missing', async () => {
        return await request(app)
            .get('/api/users')
            .expect(401)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.MISSING_AUTHORIZATION_HEADER.message)
            })
    })

    it('should return auth invalid', async () => {
        return await request(app)
            .get('/api/users')
            .auth('test', 'incorrect')
            .expect(401)
            .then(({ body }: any) => {
                const { message } = body
                expect(message).toBe(E_CODES.INVALID_CREDENTIALS.message)
            })
    })
})