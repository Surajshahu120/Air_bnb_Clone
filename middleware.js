const lists=require("./models/listing.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Reviews = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path , ",,," , req.originalUrl);
    req.session.saveRedirect=req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error","yuu must be logged in to creating listings");
       return res.redirect("/login")
 }
 next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.saveRedirect){
    res.locals.Redirecturl=req.session.saveRedirect;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listings=await lists.findById(id);
      if(! (res.locals.currUser && listings.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the owner of this edit");
        return res.redirect(`/listings/${id}`)
      }
      next();
}
module.exports.validateListing=(req,res,next)=>{
    const result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        // let errmsg=err.details.map((el)=> el.messsage).join(",");
        // console.log(err);
     throw new ExpressError(400,result.error)
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    else{
        next()
    }
}

module.exports.isauthor=async (req,res,next)=>{
    const {id,reviewid}=req.params;
    let reviews=await Reviews.findById(reviewid);
      if(! (res.locals.currUser && reviews.author._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}`)
      }
      next();
}