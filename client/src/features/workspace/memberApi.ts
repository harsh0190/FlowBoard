import api from "../../api/axios";



export const inviteMemberApi =
async(

workspaceId:string,

email:string

)=>{


const res =
await api.post(

`/api/workspaces/${workspaceId}/invite`,

{
email
}

);


return res.data;


};