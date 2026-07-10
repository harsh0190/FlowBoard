import api from "../../api/axios";



// CREATE


export const createProjectApi =
async(

workspaceId:string,

data:{

title:string;

description:string;

deadline:string;

}

)=>{


const res =
await api.post(

`/api/projects/${workspaceId}`,

data

);


return res.data;


};





// GET


export const getProjectsApi =
async(workspaceId:string)=>{


const res =
await api.get(

`/api/projects/${workspaceId}`

);


return res.data;


};