if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
    console.log(process.env.Name)
}


const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const listingsrouter=require("./routes/listing.js")
const reviewsrouter=require("./routes/review.js")
const userrouter=require("./routes/user.js")
const session=require("express-session");



let db_url=process.env.ATLAS_URL;
async function main(){
   await mongoose.connect(db_url)
}
main().then(()=>{console.log("dbs connected");})
.catch((err)=>{console.log(err)})

const MongoStore = require('connect-mongo');
const store=MongoStore.create(
    {
        mongoUrl:db_url,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    }
)
store.on("error",()=>{
    console.log("Error Occured in Mongo Session");
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}


const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine("ejs",ejsMate)





app.use(session(sessionOptions));
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())





app.get("/registeruser",async (req,res)=>{
    let fakeUser=new User({
        email:"Surajshahu123@gmail.com",
        username:"Suraj Shahu"
    })
    let newuser=await User.register(fakeUser,"Suraj@1234")
    res.send(newuser);

})

app.use("/listings",listingsrouter)
app.use("/listings/:id/review",reviewsrouter)
app.use("/",userrouter)

// universal error for all path
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found! check it once"))
}) 

app.use((err,req,res,next)=>{
    let {statusCode=500,messsage="Some error occurred"}=err;
    
    res.render("listings/error.ejs",{err})
   
})

let port=8080
app.listen(port,(req,res)=>{
    console.log(`The port is listening at ${port} `);
})




