// users hardcoded for simplicity, store in a db for production applications
const users = [
  {
    id: 1,
    username: 'test',
    password: 'test',
    firstName: 'Test',
    lastName: 'User',
  },
]

function authenticate({
  username,
  password,
}: {
  username: any
  password: any
}) {
  const user = users.find(
    u => u.username === username && u.password === password
  )
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

function getAll() {
  return users.map(u => {
    const { password, ...userWithoutPassword } = u
    return userWithoutPassword
  })
}

export default {
  authenticate,
  getAll,
}
