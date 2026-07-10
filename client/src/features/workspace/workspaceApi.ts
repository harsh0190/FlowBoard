import api from "../../api/axios";



// CREATE WORKSPACE

export const createWorkspaceApi =
async(name:string)=>{


const response =
await api.post(

"/api/workspaces",

{
name
}

);


return response.data;


};






// GET WORKSPACES


export const getWorkspacesApi =
async()=>{


const response =
await api.get(

"/api/workspaces"

);


return response.data;


};







// INVITE MEMBER


export const inviteMemberApi =
async(

workspaceId:string,

email:string

)=>{


const response =
await api.post(

`/api/workspaces/${workspaceId}/invite`,

{
email
}

);


return response.data;


};