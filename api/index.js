import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/userRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'


dotenv.config()


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to Mongo DB!")
})
.catch((err) => {
    console.log(err)
})



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

// Routes
app.use("/api/user", userRouter)

// Error middleware
app.use(errorHandler) 

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})


// 