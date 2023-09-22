import mongoose from 'mongoose'

let isConnected = false ; 

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)
  if (!process.env.MONGODB_URL) return console.log('MONGODB_URL IS NOT FOUND')

  if (isConnected) return console.log('Already connect to MONGO')

  try {
    await mongoose.connect(process.env.MONGODB_URL)

    isConnected = true
    
    console.log('Connected to MongoDB successful!')
  } catch (error) {
    console.log(error)
  }
}
