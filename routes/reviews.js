const express = require ("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/expressError.js")
const Review = require("../models/reviews.js")
const {reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js")
const {isloggedin,isreviewAuthor} = require("../middleware.js")
const controllerReview = require("../controller/review.js")


const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(404,error)
    }else{
        next()
    }
}

// ---------- REVIEW route ----------
// Post review 
router.post("/",isloggedin,validateReview,wrapAsync(controllerReview.postReview));

// delete review
router.delete("/:reviewId",isloggedin,isreviewAuthor,wrapAsync(controllerReview.destroyReview));

module.exports = router;