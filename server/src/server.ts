import dotenv from "dotenv";

dotenv.config();


import http from "http";

import app from "./app";

import { connectDB } 
from "./config/database";


import {

Server

} from "socket.io";



connectDB();



const PORT =
process.env.PORT || 5000;



const server =
http.createServer(app);



export const io =
new Server(server,{

cors:{

origin:[

"http://localhost:5173",

process.env.CLIENT_URL as string

],

credentials:true

}

});




io.on(
"connection",

(socket)=>{





// join workspace room


socket.on(

"joinWorkspace",

(workspaceId)=>{


socket.join(
workspaceId
);




}

);




socket.on(

"disconnect",

()=>{




}

);



});




server.listen(

PORT,

()=>{

console.log(
`Server running ${PORT}`
);

}

);