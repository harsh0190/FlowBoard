import api from "../../api/axios";



export const getDashboardApi =
async(

workspaceId:string

)=>{


const res =
await api.get(

`/api/dashboard/${workspaceId}`

);



return res.data;


};