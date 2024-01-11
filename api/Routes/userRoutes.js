import express from 'express'
import { 
    getUser, 
    google, 
    loginUser, 
    signUp, 
} from '../Controllers/userController.js'

const router = express.Router()

router.get('/users', getUser)
router.post('/signup', signUp)
router.post('/signin', loginUser)
router.post('/google', google)




export default router
