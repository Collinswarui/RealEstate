import jwt from "jsonwebtoken"

 

const verifyToken = (req, res,next) => {
    const token = req.cookies.access_token

    if(!token) {
        return res.status(401).json({ error: "Unauthorized access" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ error: "Forbidden" })
        } 
        
        req.user = user
        next()
       
})

       
}


export{
    verifyToken
}