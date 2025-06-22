
import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes,Route, useLocation } from 'react-router-dom'  
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import MoviesDetail from './pages/MovieDetail.jsx'
import SeatLayout from './pages/SeatLayout.jsx' 
import MyBooking from './pages/MyBooking.jsx'
import Favorite from './pages/Favorite.jsx'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer.jsx'
import  Layout  from './pages/admin/Layout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddShow from './pages/admin/AddShow.jsx'
import ListShow from './pages/admin/ListShow.jsx'
import ListBooking from './pages/admin/ListBooking.jsx'
import { useAppContext } from './context/AppContext.jsx'
import { SignIn } from '@clerk/clerk-react'

const App = () => {

  const {user}=useAppContext()

  const isAdminRoute= useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster/>
    {!isAdminRoute && <Navbar />}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/movies' element={<Movies/>}/>
      <Route path='/movies/:id' element={< MoviesDetail/>}/>
      <Route path='/movies/:id/:date' element={< SeatLayout/>}/>
      <Route path='/my-bookings' element={< MyBooking/>}/>
      <Route path='/favourites' element={< Favorite/>}/>



      <Route path='/admin/*' element={user?<Layout/>: (
        <div className='min-h-screen flex justify-center items-center'>
        <SignIn fallbackRedirectUrl={'/admin'}/>
      </div>)}>
      <Route index element={<Dashboard/>} />
      <Route path="add-shows" element={<AddShow/>} />
       <Route path="list-shows" element={<ListShow/>} />
        <Route path="list-bookings" element={<ListBooking/>} />



      </Route>

      
    </Routes>
    {!isAdminRoute && <Footer />}

    </>
  )
}

export default App

