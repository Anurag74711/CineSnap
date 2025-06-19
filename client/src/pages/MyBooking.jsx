import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import { dummyBookingData } from '../assets/assets'
import timeFormat from '../libs/TimeFormat.js'
import dateFormat from '../libs/DateFormat.js'

const MyBooking = () => {
  const currency =import.meta.env.VITE_CURRENCY

  const[bookings, setBookings] = useState([])
  const[isloading, setisLoading] = useState(true)


  const  getMybooking=async()=>{
    setBookings(dummyBookingData)
    setisLoading(false)
  }

  useEffect(()=>{
    getMybooking()
  },[])

  return !isloading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40  min-h-[80vh]'>   <BlurCircle top="100px" left="200px"/>
      <div>
        <BlurCircle bottom="0px" right="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.map(( items,index)=>(
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
          <div className='flex flex-col md:flex-row'>
            <img src={items.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded' />
            <div className='flex flex-col p-2'>
              <p className='text-lg font-semibold'>{items.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(items.show.movie.runtime)}  </p>
               <p className='text-gray-400 text-sm mt-auto'>{dateFormat(items.show.showDateTime)}</p>
            </div>
          </div>

          <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
            <div className='flex items-center gap-4'>
              <p className='text-2xlfont-semibold mb-3'>{currency}{items.amount}</p>

             {!items.isPaid && 
          <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>
           Pay Now
           </button>
  }
          </div>
        <div className='text-sm'>
            <p><span className='text-gray-400'>Total Tickets:</span> {items.bookedSeats.length}</p>
            <p><span className='text-gray-400'>Seat Number:</span> {items.bookedSeats.join(", ")}</p>
       </div>

          </div>
        </div>
      ))}

    </div>
  ) : <Loading/>
}

export default MyBooking