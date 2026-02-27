const User = require("../models/users.js")

module.exports.singUpForm = (req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.signUp = async(req,res)=>{
    try {
        let {username,email,password}= req.body
        let newUser = new User({
            username,
            email
        })
        let user = await User.register(newUser,password)
        // console.log(user);
        req.login(user,(err)=>{
            if(err){
                next(err)
            }else{
                req.flash("success","welcome to WanderLust")
                res.redirect("/listings")
            }
        })
    } catch (error) {
        req.flash("error","User already exist..!!")
        res.redirect("/signup")
    }
};

module.exports.logInForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.logIn = async(req,res)=>{
        req.flash("success","Welcome Back to WanderLust")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)
};

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","you are logged out..!!")
            res.redirect("/listings")
        }
    });
};