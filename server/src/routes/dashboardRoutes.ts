import express from "express";


import {

getDashboardStats

} from "../controllers/dashboardController";


import {

protect

} from "../middleware/authMiddleware";



const router =
express.Router();



router.use(protect);



router.get(

"/:workspaceId",

getDashboardStats

);



export default router;
