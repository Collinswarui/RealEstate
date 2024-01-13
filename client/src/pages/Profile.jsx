import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)

  
 
useEffect(() => {
  if(file) {
    handleFileUpload(file)
  }
}, [file])

const handleFileUpload = (file) => {
  const storage = getStorage(app)
  const fileName = new Date().getTime() + file.name
  const storageRef = ref(storage, fileName)
  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / 
      snapshot.totalBytes) * 100
      setFilePerc(Math.round(progress))
    },
    (error) => {
      setFileUploadErr(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => {
        setFormData({ ...formData, photo: downloadURL})
      })
    }
    );
}



const handleChange = (e) => {
  setFormData({ ...formData, [e.target.id]: e.target.value})
}

const handleSubmit = async(e) => {
  e.preventDefault()
  

  if (!currentUser || !currentUser.newUser || !currentUser.newUser._id) {
    console.error("User or user ID is undefined");
    return;
  }

  // dispatch(updateUserStart({ ...currentUser, ...formData }));
  try {
    
    const res = await fetch (`/api/user/update/${currentUser.newUser._id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json() 
    if(data.success == false) {
      dispatch(updateUserFailure(data.message))
      return
    }

    dispatch(updateUserSuccess(data))
    setUpdateSuccess(true)
  } catch (error) {
    dispatch(updateUserFailure(error.message))
  }
}

const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart())
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    })
    const data = await res.json()

    if(data.success === false) {
      dispatch(deleteUserFailure(data.message))
      return
    }
    dispatch(deleteUserSuccess(data))


  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
           onChange={(e) => setFile(e.target.files[0])}
           type="file"
           ref={fileRef} 
           hidden
           accept='image/*' />

        <img onClick={() => fileRef.current.click()} src={formData.photo ||  currentUser.photo} alt="Profile" 
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

        <p className='text-sm self-center '>
          {fileUploadErr ? (
          <span className='text-red-700'>Error Image 
          Upload</span>
           ) : filePerc > 0 && filePerc < 100 ? (
          <span className='text-slate-700'>
            {`Uplaoding ${filePerc}%`}
          </span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Successfully 
          uploaded</span> ) : (
            ''
          )
        }
        </p>

        <input 
          type="text" 
          placeholder='username' 
          id='username' 
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />

          <input 
            type="email" 
            placeholder='email' 
            id='email'
            defaultValue={currentUser.email}
            className='border p-3 rounded-lg' 
            onChange={handleChange}
          />

          <input 
            type="password" 
            placeholder='password' 
            id='password'
            className='border p-3 rounded-lg' 
            onChange={handleChange}
          />

          <button className='bg-slate-700 text-white 
          rounded-lg p-3 uppercase hover:opacity-90 
          disabled:opacity-80'>
            {loading ? "Loading..." : "Update"}
            </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
      <p className='text-red-600 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 m-5'>{updateSuccess ? "Success" : ''}</p>
    </div>
  )
}
