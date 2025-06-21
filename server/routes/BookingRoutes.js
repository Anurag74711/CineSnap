import express from 'express'
import { createBookings, getOccupiedSeats } from '../controller/bookingController.js'

const bookingRouter = express.Router()

bookingRouter.post('/create',createBookings)

bookingRouter.get('/seats/:showId',getOccupiedSeats)

export default bookingRouter;