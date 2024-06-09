const mongoose=require("mongoose")
const list=require("../models/listing.js");
const initdata=require("./data.js")

let mongourl='mongodb://127.0.0.1:27017/wonderlust'
async function main(){
   await mongoose.connect(mongourl)
}
main().then((result)=>{console.log("dbs connected");})
.catch((err)=>{console.log(err)})

const dbinitialise=async ()=>{
    await list.deleteMany({});
     initdata.data=initdata.data.map((val)=>({...val,owner:"664ef1c31c454fc0813dac0d"}))
    await list.insertMany(initdata.data);
}
dbinitialise();