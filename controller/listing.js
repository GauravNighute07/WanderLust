const Listing = require("../models/listing.js")

module.exports.index = async(req,res)=>{
    let {category , search} = req.query
    let listings;
    if(category){
        listings = await Listing.find({category:category})
    }
    else if(search){
        listings = await Listing.find({$or:[{title:{ $regex:search, $options:"i"}},{location:{$regex:search, $options:"i"}}]})
    }
    else{
        listings = await Listing.find({})
    }

    res.render("listing/index.ejs",{listings,category});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs")
};

module.exports.newListing = async (req, res) => {
    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","New Listing Added Successfully..!!")
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params
    let listingItem = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{path:"author"}
    })
    .populate("owner")
    if(!listingItem){
        req.flash("error","Listing does not Exist..!!")
        return res.redirect("/listings")
    }
    res.render("listing/show.ejs",{listingItem})
};

module.exports.editForm = async (req,res)=>{
    let{id}=req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not Exist..!!")
        return res.redirect("/listings")
    }
    res.render("listing/edit.ejs",{listing})
};

module.exports.updatedListing =async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { runValidators: true, new: true }
    );

    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image={url,filename}
        await listing.save();
    }
    
    req.flash("success","Listing Updated Successfully..!!")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted Successfully..!!")
    res.redirect("/listings")
};