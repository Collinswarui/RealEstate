import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../Controllers/listingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router()


router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.patch('/update/:id', verifyToken, updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)


export default router
