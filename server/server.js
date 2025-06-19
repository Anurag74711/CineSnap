import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app=express()
const port =3000;



await connectDB();

//middleware
app.use(express.json())

app.use(cors())

app.use(clerkMiddleware())

// API ROUTES
app.get('/',(req,res)=>{
    res.send('server is running')
})

app.use('/api/inngest', serve({ client: inngest, functions }));

app.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
})

