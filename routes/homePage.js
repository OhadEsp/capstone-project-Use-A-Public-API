import express from "express";

const router = express.Router();

import getHomePage from "../controllers/homePage.js";

/**
 * Route to render the home page.
 */
router.get("/", getHomePage);

export default router;