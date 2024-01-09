import express from 'express'
import { getUser, signUp } from '../Controllers/userController.js'

const router = express.Router()

router.get('/users', getUser)
router.post('/signup', signUp)


export default router
