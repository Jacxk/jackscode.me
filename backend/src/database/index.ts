import { connect, ConnectionOptions, Mongoose } from 'mongoose'

const [ user, password, host, db ] = [
  process.env.MONGO_USER,
  process.env.MONGO_PASSWORD,
  process.env.MONGO_HOST,
  process.env.MONGO_DB
]

const url = `mongodb+srv://${ user }:${ password }@${ host }/${ db }`

const options: ConnectionOptions = {
  useNewUrlParser: true,
  poolSize: 4,
  useUnifiedTopology: true,
  useFindAndModify: false
}

export function connectDB(): Promise<Mongoose> {
  console.log('Connecting to database')
  return connect(url, options)
}

export * as Schemas from './schemas'
