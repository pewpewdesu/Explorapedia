import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Explore from './pages/Explore'
import Layout from './components/Layout'

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<Layout />}>
          <Route path = "/" element = {<Home />} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/register" element = {<Register />} />
          <Route path = "/explore" element = {<Explore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


