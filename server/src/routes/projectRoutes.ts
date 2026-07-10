import express from "express";


import {

createProject,
getProjects

} from "../controllers/projectController";


import {

protect

} from "../middleware/authMiddleware";



const router =
express.Router();



router.use(protect);



// create project


router.post(

"/:workspaceId",

createProject

);



// get workspace projects


router.get(

"/:workspaceId",

getProjects

);



export default router;