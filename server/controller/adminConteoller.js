import { clerkClient, getAuth } from "@clerk/express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";


export const isAdmin =async(req , res)=>{

     try {
    const userId = req.auth().userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    const isAdmin = user.PrivateMetadata?.role === "admin";

    return res.json({ success: true, isAdmin });
  } catch (error) {
    console.error("isAdmin error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
    
}

// API TO GET DASHBOARD DATA
export const getDashboardData =async(req , res)=>{
    try {
        const bookings = await Booking.find({isPaid:true})
        const activeShows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie')

        const totalUser=await User.countDocuments()

        const dashBoardData={
            totalBookings:bookings.length,
            totalRevenue:bookings.reduce((acc,booking)=>acc+booking.amount,0),
            activeShows,
            totalUser


        }

        res.json({success:true , dashBoardData})
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
        
    }
}

//Api to get all show

export const getAllShows=async(req , res)=>{
    try {
        const shows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1})
        res.json({success:true , shows})
        
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
        
    }
}

// api to get all bookings

export const getAllBookings =async(req , res)=>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path:'show',
            populate:{path:'movie'}
        }).sort({createdAt:-1})
        
        res.json({success:true , bookings})
        
    } catch (error) {
        console.error(error);
        res.json({success:false , message:error.message})
        
    }
}