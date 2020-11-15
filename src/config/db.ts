import * as mongoose from 'mongoose'
import config from './config'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo.uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

export default connectDB
