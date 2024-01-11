import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'

export default function OAuth() {
    const dispatch = useDispatch()
    const handleGoogleClick = async() => {
        try {
            // Set the provider and Auth
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            // Create the sign in pop up
            const result = await signInWithPopup(auth, provider)
            
            // Send the result from google to the backend to create a user
            const res = await fetch ('api/auth/google', {
                method: POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })
            
            const data = await res.json()
            dispatch(signInSuccess(data))
        } catch (error) {
            console.log('could not sign in with google', error)
        }
    }
  return (
    <button onClick={handleGoogleClick} type ='button' className='bg-red-700 text-white p-3 rounded-lg 
    uppercase hover:opacity-85'>
      Continue with google
    </button>
  )
}
