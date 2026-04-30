import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';


const userRouter=express.Router();

console.log("User router active");

userRouter.get("/current-user",isAuth,getCurrentUser);


export default userRouter;