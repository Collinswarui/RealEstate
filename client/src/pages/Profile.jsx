import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import { Link } from 'react-router-dom'


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showEstateError, setShowEstateError] = useState(false)
  const[userEstates, setUserEstates] = useState([])
  
 
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


// console.log(currentUser._id);
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
};


const handleSubmit = async(e) => {
  e.preventDefault()
  

  if (!currentUser || !currentUser._id ) {
    console.error(currentUser);
  
    return;
  }

  // dispatch(updateUserStart({ ...currentUser, ...formData }));
  try {
    dispatch(updateUserStart())

    const res = await fetch (`/api/user/update/${currentUser._id}`,
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


const handleSignOut = async() => {
  try {
    dispatch(signOutUserStart())

    const res = await fetch('/api/user/signout')
    const data = await res.json()

    if (data.success === false) {
      dispatch(signOutUserFailure(data.message))
      return
    }

    dispatch(signOutUserSuccess(data))
  } catch (error) {
    dispatch(signOutUserFailure(data.message))
   }
}

const handleShowEstates = async() => {
  try {  
    setShowEstateError(false)

    const res = await fetch(`/api/user/listing/${currentUser._id}`)
    const data = await res.json()

    if(data.success === false) {
      setShowEstateError(true)
      return 
    }
    setUserEstates(data)
  } catch (error) {
    setShowEstateError(true)
  }
}


const handleListingDelete = async(listingId) => {
  
  try {
    const res = await fetch(`/api/listing/delete/${listingId}`, {
      method: 'DELETE',
    })
  
    const data  = await res.json()
  
    if(data.success === false) {
      console.log(data.message);
      return
    }
    setUserEstates((prev) =>  
     prev.filter((listing) => listing._id !== listingId)
    )
  } catch (error) {
    console.log(error.message)
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
            disabled
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
            <Link className='bg-green-700 text-white p-3
            rounded-lg uppercase text-center hover:opacity-70' to={'/create-listing'}>
              Create Estate 
            </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
      <p className='text-red-600 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 m-5'>{updateSuccess ? "Success" : ''}</p>
      <button onClick={handleShowEstates} className='text-green-700 w-full'>Show Estates</button>
      <p className='text-red-700 mt-5'>
        {showEstateError ? 'Error showing estates' : ''}
      </p>
        {userEstates && userEstates.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl 
          font-semibold'>Your Estates</h1>
          {userEstates.map((listing) => (
          <div key={listing._id} 
          className='border rounded-lg p-3 flex gap-4 justify-between
          items-center'>
            <Link to={`/listing/${listing._id}`}> 
            {listing.imageUrls?.[0] && (
          <img src={listing.imageUrls[0]} 
          alt="estate images"
          className='h-16 w-16 object-contain'/>
            )}
            </Link>
            <Link className='font-semibold text-slate-700
             flex-1 hover:underline truncate'
            to={`/listing/${listing._id}`}> 
            <p >{listing.name}</p>
            </Link>

            <div className='flex flex-col items-center font-semibold'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700
              uppercase'>
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700
              uppercase'>
                Edit
              </button>
              </Link>
             
            </div>

          </div>
          ))}
        </div>
        
        }
    </div>
  )
}
