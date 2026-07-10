import api from "../../api/axios";


export const registerApi = async(data:{
name:string;
email:string;
password:string;

})=>{


const response =
await api.post(
"/api/auth/register",
data
);


return response.data;

};



export const loginApi = async(data:{
email:string;
password:string;

})=>{


const response =
await api.post(
"/api/auth/login",
data
);


return response.data;

};