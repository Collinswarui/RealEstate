import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/userRoutes.js'


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

app.use("/api/user", userRouter)


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})


// 