import express from 'express'
import { 
    deleteUser,
    getUser, 
    google, 
    loginUser, 
    signUp,
    updateUser, 
} from '../Controllers/userController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/users', getUser)
router.post('/signup', signUp)
router.post('/signin', loginUser)
router.post('/google', google)


router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)







export default router
