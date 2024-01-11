import jwt from "jsonwebtoken"

 

const verifyToken = (req, res,next) => {
    const token = req.cookies.access_token

    if(!token) {
        res.status(401)
        throw new Error("Unauthorized access")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            res.status(403)
            throw new Error("Forbidden")
        } 
        
        req.user = user
        next()
       
})

       
}


export{
    verifyToken
}