import { Response } from "express";

import Project from "../models/Project";

import Task from "../models/Task";



export const getDashboardStats =
async(req:any,res:Response)=>{


const workspaceId =
req.params.workspaceId;



const projects =
await Project.find({

workspace:workspaceId

});



const projectIds =
projects.map(

p=>p._id

);



const tasks =
await Task.find({

project:{

$in:projectIds

}

});



const completed =
tasks.filter(

t=>t.status==="done"

).length;



const pending =
tasks.length-completed;




res.json({


projects:
projects.length,


tasks:
tasks.length,


completed,


pending,


progress:

tasks.length===0

?

0

:

Math.round(

(completed/tasks.length)*100

),



statusData:[


{

name:"Todo",

value:

tasks.filter(
t=>t.status==="todo"
).length

},



{

name:"Progress",

value:

tasks.filter(
t=>t.status==="in-progress"
).length

},



{

name:"Review",

value:

tasks.filter(
t=>t.status==="review"
).length

},



{

name:"Done",

value:completed

}


]


});


};