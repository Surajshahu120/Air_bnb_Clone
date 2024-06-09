const lists=require("../models/listing")

// show all data 
module.exports.showAllData=async (req,res)=>{
    let allListings= await lists.find();
   
     res.render("listings/index.ejs",{allListings})
 }

//  delete listing
 module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
   await lists.findByIdAndDelete(id);
   req.flash("success","listing deleted")
   res.redirect("/listings")
}

// update listing
module.exports.updateListing=async (req,res)=>{
        
    let {id}=req.params;
      let updatedata=await lists.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !== 'undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedata.image={url,filename}
    await updatedata.save();
   }
      req.flash("success","listing updated")
     
      res.redirect(`/listings/${id}`)
 }

 // edit form
 module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let singleData=await lists.findById(id);
   
    if(!singleData){
       req.flash("error","listing you are requested for does not exist");
       res.redirect("/listings");
   }
   let OriginalUrl=singleData.image.url;
   OriginalUrl=OriginalUrl.replace("/upload","/upload/h_250")
    res.render("listings/update.ejs",{singleData,OriginalUrl})
}

// single data display
module.exports.singleDataDisplay=async (req,res,next)=>{
    
    let {id}=req.params;
    let Listing=await lists.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(Listing);
    if(!Listing){
    req.flash("error","listing you are requested for does not exist")
    res.redirect("/listings")
}
res.render("listings/showSingleData.ejs",{Listing})
}

// add new listing
module.exports.addNewListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listed= new lists(req.body.listing);
    console.log(req.user);
    listed.owner=req.user._id;
    listed.image={url,filename}
      await listed.save();
      req.flash("success","new listing created")
     res.redirect("/listings");
}

// new form
module.exports.newForm=(req,res)=>{
    console.log(req.user);
     res.render("listings/form.ejs");
 }