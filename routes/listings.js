const express = require ("express")
const router = express.Router()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/expressError.js")
const {listingSchema} = require("../schema.js")
const {isloggedin, isOwner} = require("../middleware.js")
const contollerListing = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(404,error)
    }else{
        next();
    }
}

// ---------- INDEX route ----------
router.get("/",wrapAsync(contollerListing.index));

// ---------- NEW route ----------
router.get("/new",isloggedin,contollerListing.renderNewForm);

router.post("/",isloggedin,upload.single("listing[image]"),validateListing,wrapAsync(contollerListing.newListing));


// ---------- SHOW route ----------
router.get("/:id",wrapAsync(contollerListing.showListing));

// ---------- EDIT route ----------
router.get("/:id/edit",isloggedin,isOwner,validateListing,wrapAsync(contollerListing.editForm));

router.put("/:id",isloggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(contollerListing.updatedListing));

// ---------- DELETE route ----------
router.delete("/:id",isloggedin,isOwner,wrapAsync(contollerListing.destroyListing));

module.exports = router;