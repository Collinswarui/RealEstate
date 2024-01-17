import express from "express";
import { createListing, deleteListing } from "../Controllers/listingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router()


router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)


export default router
