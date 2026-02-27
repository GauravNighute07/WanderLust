if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express")
const app = express()
const port = 8080
const mongoose = require("mongoose")
const url = process.env.URL
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/users.js")

const listingsRouter = require("./routes/listings.js")
const reviewsRouter = require("./routes/reviews.js")
const usersRouter = require("./routes/users.js")

main()
.then(()=>{
    console.log("mongoDB connection Established..!!")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(url)
}

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))
app.engine('ejs', ejsMate);

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))

const store = MongoStore.create({
    mongoUrl:url,
    crypto:{
        secret : process.env.SECRET
    },
    touchAfter:24*3600
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

// app.get("/",(req,res)=>{
//     res.send("Welcome to Root")
// })

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
});


app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/", usersRouter)


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="some error occured"}=err
    res.status(statusCode).render("error.ejs",{message})
})


app.listen(port,()=>{
    console.log("app is listening on port 8080")
})