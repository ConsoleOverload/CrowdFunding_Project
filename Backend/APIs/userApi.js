import exp from "express"
import mongoose from "mongoose"
import {userModel} from "../Models/userModel.js"
export const userApp = exp.Router()

userApp.post('/register',async(req,res)=>{
    console.log('aa');
    
})








