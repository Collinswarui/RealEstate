import express from 'express'
import { 
    getUser, 
    loginUser, 
    signUp, 
} from '../Controllers/userController.js'

const router = express.Router()

router.get('/users', getUser)
router.post('/signup', signUp)
router.post('/signin', loginUser)



export default router
