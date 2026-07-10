import express from "express";


import {

createTask,
getTasks,
updateTaskStatus,
addComment

} from "../controllers/taskController";


import {

protect

} from "../middleware/authMiddleware";



const router =
express.Router();



router.use(protect);




// Create task

router.post(

"/project/:projectId",

createTask

);




// Get tasks

router.get(

"/project/:projectId",

getTasks

);




// Kanban update


router.patch(

"/:taskId/status",

updateTaskStatus

);




// Comments


router.post(

"/:taskId/comment",

addComment

);



export default router;