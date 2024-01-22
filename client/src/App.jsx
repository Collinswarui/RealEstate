import { BrowserRouter as Router, Routes, Route }  from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Profile from "./pages/Profile"
import About from "./pages/About"
import SignUP from "./pages/SignUp"
import Header from "./components/Header "
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"
import Footer from "./components/Footer"



export default function App() {
  return (
   <Router>
    <div className="flex flex-col min-h-screen">
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUP />} />
      <Route path="/listing/:listingId" element={<Listing />} />

      <Route  element={<PrivateRoute />} >

      <Route path="/profile" element={<Profile />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/update-listing/:listingId" element={<UpdateListing />} />


      </Route>

      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />


    </Routes>
    <div className="flex-grow"></div>
    <Footer />
    </div>
    
   </Router>
  )
}
