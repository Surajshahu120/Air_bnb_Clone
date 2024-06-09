const User=require("../models/user.js")

// signup data save plus login
module.exports.signup=async (req,res)=>{
    try{
      const {username,email,password}=req.body;
    const newUser=new User({email,username});
  const registereduser= await User.register(newUser,password);
  req.login(registereduser,(err)=>{
    if(err){
      return next(err)
    }
    req.flash("success","Welcome to wonderlust");
    res.redirect("/listings")

  })
  
    }
    catch(err){
      req.flash("error",error.message);
      req.redirect("/signup")
    }
}

// on click form open
module.exports.rendersignUpForm=(req,res)=>{
    res.render("users/signup.ejs")
  }

  // login authentication
 module.exports.login= async (req,res)=>{
    req.flash("success","welcome to wonderlust loggedin successfully")
    let SavedRedirects=res.locals.Redirecturl || "/listings";
    res.redirect(SavedRedirects);
 
  }

  // login form
  module.exports.renderloginForm=(req,res)=>{
    res.render("users/login.ejs")
  }

  // log out
  module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
      if(err){
        return next(err)
      }
      req.flash("success","logged you out")
      res.redirect("/listings");   
    }) 
    }