import {clerkClient} from "@clerk/express"

export const protectAdmin =async (req,res,next)=>{
    try{
    const {userId}=req.user;
    const user=await clerkClient.users.getUser(userId);
    if(user.privateMetadata.cole !== "admin"){
        return res.json({
            sucess:false,
            message:"Unauthorized Access"
        })
       
}
 next();
}
catch(error){
    return res.json({
        sucess:false,
        message:"Unauthorized Access"
    })
}
}