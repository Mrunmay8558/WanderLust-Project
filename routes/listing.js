const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Creating a Function That validate server side error

//index Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggin, upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
    
//New Route
router.get("/new", isLoggin, listingController.renderNewForm);


//Show Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggin, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggin, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit",  isLoggin,isOwner,wrapAsync(listingController.editListing));
module.exports= router;