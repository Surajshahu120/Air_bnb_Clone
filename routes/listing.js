const express=require("express")
const router=express.Router();
const asyncWrap=require("../utils/asyncWrap.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
// show all data
.get(asyncWrap(listingcontroller.showAllData))
  // add route
.post(isLoggedIn,upload.single('listing[image]'),asyncWrap(listingcontroller.addNewListing))

 
// new form 
 router.get("/new",isLoggedIn,asyncWrap(listingcontroller.newForm))
 
router.route("/:id")
 // show single route
 .get(asyncWrap(listingcontroller.singleDataDisplay))
  // edit route
  .put(isOwner,upload.single('listing[image]'),validateListing,asyncWrap(listingcontroller.updateListing)) 
 // delete route
 .delete(isLoggedIn,isOwner,asyncWrap(listingcontroller.destroyListing))

 //edit form
 router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingcontroller.editForm))
 



 module.exports=router;