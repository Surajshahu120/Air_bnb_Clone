const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap=require("../utils/asyncWrap.js")
const {validateReview,isLoggedIn,isauthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

// TO delete review
router.delete("/:reviewid",isLoggedIn,isauthor,asyncWrap(reviewController.deleteReview))

// for review submitting form
router.post("/",validateReview,asyncWrap(reviewController.reviewSubmittingForm))

module.exports=router;