const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Create Review 
router.post("/", isLoggin, validateReview, wrapAsync(reviewController.createReview));
  
  //DELETE REVIEw
router.delete("/:reviewId",isLoggin, isReviewAuthor,wrapAsync(reviewController.deleteReview));
  
module.exports= router;