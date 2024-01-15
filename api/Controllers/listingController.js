import asyncHandler from "express-async-handler" 

// Create a listing
const createListing = asyncHandler(async(req, res) => {
    res.send("Listing created")
})


export {
    createListing,
}