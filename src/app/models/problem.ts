import * as mongoose from 'mongoose'

const ProblemSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Number,
    required: true,
  },
})

export default mongoose.model('Problem', ProblemSchema)
