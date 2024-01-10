import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import User from '../Models/userModel.js'

const getUser = asyncHandler(async(req, res) => {
    res.send("User found")
})


const signUp = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body

    // Validation
    if(!username || !email || !password) {
        res.status(400)
        throw new Error("Please input all the fields")
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{username}, {email}]})

    if(userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.username,
            email: user.email
        }) 
    } else {
         res.status(400)
         throw new Error("Invalid user data")   
    }
})


export{
    getUser,
    signUp
}