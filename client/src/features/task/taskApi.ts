import api from "../../api/axios";



export const createTaskApi =
async(

projectId:string,

data:any

)=>{


const res =
await api.post(

`/api/tasks/project/${projectId}`,

data

);


return res.data;

};




export const getTasksApi =
async(projectId:string)=>{


const res =
await api.get(

`/api/tasks/project/${projectId}`

);


return res.data;

};

export const addCommentApi =
async(

taskId:string,

text:string

)=>{


const res =
await api.post(

`/api/tasks/${taskId}/comment`,

{
text
}

);


return res.data;


};


export const updateTaskStatusApi =
async(

taskId:string,

status:string

)=>{


    
const res =
await api.patch(

`/api/tasks/${taskId}/status`,

{
status
}

);


return res.data;


};