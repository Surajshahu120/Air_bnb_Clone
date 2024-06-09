const lists=require("../models/listing");
const Reviews = require("../models/review.js");
module.exports.deleteReview=async (req,res)=>{
    const {id,reviewid}=req.params;
   let listres= await lists.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
  let reviewres = await Reviews.findByIdAndDelete(reviewid);
  req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)
}

module.exports.reviewSubmittingForm=async (req,res)=>{
    let listing=await lists.findById(req.params.id)
    const reviewdata=new Reviews(req.body.review);
    reviewdata.author=req.user._id;
    console.log(reviewdata);
    listing.reviews.push(reviewdata)
    await listing.save();
    await reviewdata.save();
    req.flash("success","review added")
   res.redirect(`/listings/${req.params.id}`)
}