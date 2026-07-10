import {

Request,
Response,
NextFunction

} from "express";


import jwt from "jsonwebtoken";

import User from "../models/User";



export const protect =
async(

req:any,

res:Response,

next:NextFunction

)=>{


let token =
req.headers.authorization;



if(
token &&
token.startsWith("Bearer")
){


try{


token =
token.split(" ")[1];


const decoded:any =
jwt.verify(

token,

process.env.JWT_SECRET as string

);



req.user =
await User
.findById(decoded.id)
.select("-password");



next();


}catch(error){


return res
.status(401)
.json({

message:
"Invalid token"

});


}


}


else{


return res
.status(401)
.json({

message:
"No token"

});


}


};