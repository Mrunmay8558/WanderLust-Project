const Listing = require("../models/listing.js");

//Index Routes
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New ROute
module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"...",  filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not Exist!!!!")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not Exist!!!!")
        res.redirect("/listings");
    }

    let orginalImageUrl =  listing.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, orginalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
      throw new ExpressError(400,"Send Valid Data For Listings");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};