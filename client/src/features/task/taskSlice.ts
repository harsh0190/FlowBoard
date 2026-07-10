import { createSlice } from "@reduxjs/toolkit";


interface Task {

    _id:string;

    title:string;

    description:string;

    priority:
    "low" |
    "medium" |
    "high";

    status:
    "todo" |
    "in-progress" |
    "review" |
    "done";

    comments?:any[];

}


interface State {

    tasks:Task[];

}


const initialState:State={

    tasks:[]

};



const taskSlice = createSlice({

name:"task",

initialState,


reducers:{


setTasks:(state,action)=>{


state.tasks =
action.payload;


},




updateTaskLocal:(state,action)=>{


const task =
state.tasks.find(

t => 
t._id === action.payload.id

);



if(task){


task.status =
action.payload.status;


}


},





updateTask:(state,action)=>{


const index =
state.tasks.findIndex(

t =>
t._id === action.payload._id

);



if(index !== -1){


state.tasks[index] =
action.payload;


}


}



}


});




export const {

setTasks,

updateTaskLocal,

updateTask


}=taskSlice.actions;




export default taskSlice.reducer;