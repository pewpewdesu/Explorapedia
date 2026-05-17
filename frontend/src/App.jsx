import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Explore from './pages/Explore'
import Trips from './pages/Trips'
import TripDetail from './pages/TripDetail'
import SharedTrips from './pages/SharedTrips'
import SharedTripDetail from './pages/SharedTripDetail'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/shared-trips" element={<SharedTrips />} />
          <Route path="/shared-trips/:id" element={<SharedTripDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


