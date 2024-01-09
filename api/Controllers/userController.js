import asyncHandler from 'express-async-handler'

const getUser = asyncHandler(async(req, res) => {
    res.send("User found")
})



export{
    getUser
}