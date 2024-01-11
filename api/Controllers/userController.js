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


        // User validation 
        if(!email || !password) {
            res.status(400)
            throw new Error("Please input all the fields")
        }
        
        
        // Check if the user exists
        const user = await User.findOne({email})
        if(!user) {
            res.status(400)
            throw new Error("User does not exist")
        }

        // Compare the password entered by the user with hashed password in the database
        const validPassword = bcryptjs.compareSync(password, user.password)
        if(!validPassword) {
            res.status(400)
            throw new Error("Invalid Credentials")
        }

        // Create a token 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.cookie('access_token', token, {httpOnly: true})

        // Return the user but exclude the password
        const newUser = await User.findOne({email}).select("-password")
        if(user && validPassword) {
            res.status(201).json({
               newUser
            })
        } else{
            res.status(400)
            throw new Error("Invalid User details")
        }
   
        
    
})


// Google signin & signup logic
const google = asyncHandler(async(req, res) => {
    try {
        // Check the user returned from the rsult if they already exist
        const user = await User.findOne({ email: req.body.email })

        // If the user exists log them in
         if(user) { 
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)

            
         } else{
            // Genrate a random password and hash it
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

            // Create a new user from the result from google
            const newUser = new User({ 
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                photo: req.body.photo
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)
         }
    } catch (error) {
        console.error("Error in Google sign-in:", error);
        res.status(400).json({ success: false, message: "Invalid user details" })
    
    }
})


export{
    getUser,
    signUp,
    loginUser,
    google,
}