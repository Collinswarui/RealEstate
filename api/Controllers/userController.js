import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../Models/userModel.js'

const getUser = asyncHandler(async(req, res) => {
    res.send("User found")
})


// User Sign Up
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


// User Login
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    try {
        // User validation 
        if(!email || !password) {
            res.status(400)
            throw new Error("Please input all the fields")
        }
        
        
        // Check if the user exists
        const validUser = await User.findOne({email})
        if(!validUser) {
            res.status(400)
            throw new Error("User does not exist")
        }

        // Compare the password entered by the user with hashed password in the database
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) {
            res.status(400)
            throw new Error("Invalid User Credentials")
        }

        // Create a token 
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        res.cookie('access_token', token, {httpOnly: true})
        
        if(validUser && validPassword) {
            res.status(201).json({
                name: validUser.name,
                email,
                token
            })
        }
    } catch (error) {
        
    }
})


export{
    getUser,
    signUp,
    loginUser,
}