import express from "express";


import {

createWorkspace,
getWorkspaces,
inviteMember

} from "../controllers/workspaceController";


import {
protect
} from "../middleware/authMiddleware";


import {
isWorkspaceAdmin

} from "../middleware/workspaceMiddleware";



const router =
express.Router();


router.use(protect);



router.post(
"/",
createWorkspace
);



router.get(
"/",
getWorkspaces
);



// invite users


router.post(

"/:workspaceId/invite",

isWorkspaceAdmin,

inviteMember

);



export default router;