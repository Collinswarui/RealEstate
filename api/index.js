import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/userRoutes.js'
import listingRouter from './Routes/listingRoute.js'
import { errorHandler } from './middleware/errorMiddleware.js'
import path from 'path'


dotenv.config()


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to Mongo DB!")
})
.catch((err) => {
    console.log(err)
})

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

// Routes
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)


app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

// Error middleware
app.use(errorHandler) 

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})


// 