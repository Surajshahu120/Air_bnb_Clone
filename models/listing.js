const mongoose=require("mongoose");
const Review=require("./review.js")
const { type } = require("../schema");
const Schema=mongoose.Schema;





const listSchema=new Schema({
    title:{
        type:"String",
        required:true
    },
    description:{
        type:"String",
        
    },
    image:{
        filename:String,
        url:String,
    },
    price:{
        type:"Number",
        
    },
    location:{
        type:"String",
        
    },
    country:{
        type:"String",
        
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews"
        }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    

})

listSchema.post("findOneAndDelete",async (list)=>{
       if(list.reviews.length){
           await Review.deleteMany({_id:{$in:list.reviews}})
       }
})

const Listing=mongoose.model("Listing",listSchema)
module.exports=Listing;

