/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'


let dbInstance = null

//Khởi tạo kết nối MongoDB
const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}
)
export const CONNECT_DB = async () => {
  try {
    if (!dbInstance) {
      await client.connect()
      dbInstance = client.db(env.DATABASE_NAME)
      // console.log(env.DATABASE_NAME)
      console.log('MongoDB connected successfully')
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
export const GET_DB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call CONNECT_DB first.')
  }
  return dbInstance
}

export const CLOSE_DB = async () => {
  try {
    if (dbInstance) {
      await client.close()
      dbInstance = null
      console.log('MongoDB connection closed')
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
}