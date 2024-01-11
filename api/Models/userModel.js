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
        default: "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg",
    },
}, {timestamps: true})  


const User = mongoose.model('User', userSchema)

export default User
