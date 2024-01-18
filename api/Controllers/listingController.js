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
    // Check if the estate exists in the database
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


// Update Estate
const updateListing = asyncHandler(async(req, res, next) => {
    // Check if the estate exists in the database
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
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        )
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }

})


// Get listing
const getListing = asyncHandler(async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)

        if(!listing) {
            res.status(404)
            throw new Error("Listing not found")
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
})


// Functionality to search for estates
const getListings = asyncHandler(async(req, res, next) => {
    try {

        const limit = parseInt(req.query.limit) || 9  
        const startIndex = parseInt(req.query.startIndex) || 0
       

        // If offer is undefined or false search for both offers that are true or false in the database
        let offer = req.body.offer
        if(offer === undefined || offer === 'false') {
            offer = {$in: [false, true]}
        }

        // If furnished is undefined or false search for both where furnished is either true or false in the database
        let furnished = req.query.furnished
        if(furnished === undefined || furnished === 'false') {
            furnished = {$in: [false, true]}
        }

        let parking = req.query.parking
        if(parking === undefined || parking === 'false') {
            parking = {$in: [false, true]}
        }

        let type = req.query.type
        if(type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || ''

        const sort = req.query.sort || 'createdAt'

        const order = req.query.order || 'desc'


        const listings = await Listing.find({
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex)

        return res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
})

export {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings,
}