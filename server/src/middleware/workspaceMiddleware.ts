import { Response, NextFunction } from "express";

import Workspace from "../models/Workspace";


export const isWorkspaceAdmin =
async (
    req:any,
    res:Response,
    next:NextFunction
)=>{


const workspace =
await Workspace.findById(
    req.params.workspaceId
);



if(!workspace){

return res
.status(404)
.json({
message:"Workspace not found"
});

}



const member =
workspace.members.find(

m =>
m.user.toString()
===
req.user._id.toString()

);



if(!member){

return res
.status(403)
.json({

message:"Not a workspace member"

});

}



if(member.role !== "admin"){


return res
.status(403)
.json({

message:"Admin access required"

});

}



req.workspace = workspace;


next();


};