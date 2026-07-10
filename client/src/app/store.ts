import {

configureStore

} from "@reduxjs/toolkit";

import taskReducer
from "../features/task/taskSlice";

import authReducer
from "../features/auth/authSlice";


import workspaceReducer
from "../features/workspace/workspaceSlice";


import projectReducer
from "../features/project/projectSlice";

import notificationReducer
from "../features/notification/notificationSlice";


export const store =
configureStore({

reducer:{

auth:authReducer,

workspace:workspaceReducer,

project:projectReducer,

task:taskReducer,

notification:notificationReducer

}


});



export type RootState =
ReturnType<typeof store.getState>;



export type AppDispatch =
typeof store.dispatch;