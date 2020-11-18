import userService from '../../app/services/userService'

describe('userService', () => {
    test('authenticate method: should auth with credentials and return user object', async () => {
        const credentials = {
            username: 'test',
            password: 'test'
        }
        const userObject = {
            id: 1,
            username: 'test',
            firstName: 'Test',
            lastName: 'User',
        }

        const result = await userService.authenticate(credentials)

        expect(result).toMatchObject(userObject)
    })

    test('authenticate method: should not auth a user with incorrect credentials', async () => {
        const credentials = {
            username: 'test',
            password: 'incorrect'
        }

        const result = await userService.authenticate(credentials)

        expect(result).toBe(undefined)
    })

    test('getAll method: should return all users without password', () => {
        const result = userService.getAll()

        expect(result.length).toBe(2)
    })
})