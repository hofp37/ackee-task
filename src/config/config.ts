import { createLoader, safeValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.jsonc',
})

const configSchema = {
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
  enableTests: loader.bool('ENABLE_TESTS'),
  node: {
    env: loader.string('NODE_ENV'),
  },
  server: {
    port: loader.number('SERVER_PORT'),
  },
  mongo: {
    uri: loader.string('MONGO_URI'),
  },
  types: {
    valid: [loader.string('RIDDLE_TYPE'), loader.string('EXPRESSION_TYPE')],
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
