import express from 'express'
import { 
    deleteUser, 
    getUserEstates, 
    google, 
    loginUser, 
    signOut, 
    signUp,
    updateUser, 
} from '../Controllers/userController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/listing/:id', verifyToken, getUserEstates)
router.post('/signup', signUp)
router.post('/signin', loginUser)
router.post('/google', google)


router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/signout', signOut)







export default router
