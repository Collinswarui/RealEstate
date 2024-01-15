import asyncHandler from "express-async-handler" 
import Listing from "../Models/listingModel.js"

// Create a listing
const createListing = asyncHandler(async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
})


export {
    createListing,
}