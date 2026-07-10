import {

Request,
Response

} from "express";


import User from "../models/User";

import {

generateToken

} from "../utils/generateToken";



// REGISTER


export const register =
async(
req:Request,
res:Response
)=>{


const {

name,
email,
password

}=req.body;



const exists =
await User.findOne({email});



if(exists){


return res
.status(400)
.json({

message:
"User already exists"

});


}



const user =
await User.create({

name,

email,

password

});



res.status(201).json({

user:{

_id:user._id,

name:user.name,

email:user.email

},


token:
generateToken(
user._id.toString()
)


});


};



// LOGIN


export const login =
async(

req:Request,

res:Response


)=>{


const {

email,

password

}=req.body;



const user =
await User.findOne({email});

if(!user){


return res.status(404)
.json({

message:"User not found"

});


}

if(
!(await user.comparePassword(password))
){

return res
.status(401)
.json({

message:
"Invalid credentials"

});

}



res.json({

user:{

_id:user._id,

name:user.name,

email:user.email

},


token:
generateToken(
user._id.toString()
)


});


};