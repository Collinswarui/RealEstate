import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
}, {timestamps: true})  


const User = mongoose.model('User', userSchema)

export default User
