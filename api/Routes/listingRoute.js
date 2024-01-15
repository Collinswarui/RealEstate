import express from "express";
import { createListing } from "../Controllers/listingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router()


router.post('/create', verifyToken, createListing)


export default router