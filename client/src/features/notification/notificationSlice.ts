import {

createSlice

} from "@reduxjs/toolkit";





interface Notification{


message:string;


time:string;


read:boolean;


}





interface NotificationState{


notifications:Notification[];


}






const initialState:NotificationState={


notifications:[]


};







const notificationSlice =
createSlice({


name:"notification",


initialState,


reducers:{






addNotification:(state,action)=>{



state.notifications.unshift({


message:action.payload,


time:new Date()
.toLocaleTimeString(),


read:false


});



},








markAllRead:(state)=>{



state.notifications.forEach(

notification=>{


notification.read=true;


}

);



},









clearNotifications:(state)=>{



state.notifications=[];



}






}



});








export const {


addNotification,


markAllRead,


clearNotifications


}=notificationSlice.actions;








export default notificationSlice.reducer;