const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const passport=require("passport");
const asyncWrap=require("../utils/asyncWrap.js")
const  {redirectUrl}=require("../middleware.js")
const userController=require("../controllers/users.js")

router.route("/signup")
//signup click on button
.get(userController.rendersignUpForm)
// signup create ke saath data bhi save
.post(asyncWrap(userController.signup))


router.route("/login")
// login click ke baad open hota hai
.get(userController.renderloginForm)
// login authentication
.post(redirectUrl,passport.authenticate(
  "local",{
   failureRedirect:"/login",
   failureFlash:true}
 ),userController.login)

 // logout 
router.get("/logout",userController.logout)

module.exports=router;