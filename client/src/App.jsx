import { BrowserRouter as Router, Routes, Route }  from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Profile from "./pages/Profile"
import About from "./pages/About"
import SignUP from "./pages/SignUp"
import Header from "./components/Header "
import PrivateRoute from "./components/PrivateRoute"



export default function App() {
  return (
   <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUP />} />
      <Route  element={<PrivateRoute />} >
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/about" element={<About />} />

    </Routes>
   </Router>
  )
}
