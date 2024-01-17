import asyncHandler from "express-async-handler" 
import Listing from "../Models/listingModel.js"
import { errorHandler } from "../middleware/errorMiddleware.js"

// Create a listing
const createListing = asyncHandler(async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
})



// Delete listing
const deleteListing = asyncHandler(async(req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if(!listing) {
        res.status(404)
        throw new Error('Estate not found');
        
    }

    if(req.user.id !== listing.userRefs) {
        res.status(404)
        throw new Error('You can only delete your own Estates')
        
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("Estate deleted successfully")
    } catch (error) {
        next(error)
    }

})

export {
    createListing,
    deleteListing,
}