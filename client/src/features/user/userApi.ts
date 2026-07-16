import api from "../../api/axios";



export const updatePasswordApi =
async(password:string)=>{




const res =
await api.put(

"/api/users/profile",

{
password
}

);


return res.data;


};