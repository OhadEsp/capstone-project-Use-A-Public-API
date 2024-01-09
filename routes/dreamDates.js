import express from "express";
import { body } from "express-validator";

const router = express.Router();

import dreamDates from "../controllers/dreamDates.js";

/**
 * Route to display the dates generator page and fetch random user data.
 */
router.get("/dreamDates", dreamDates.getRandomDreamDate);

/**
 * Route to handle form submission for generating dream dates.
 * Validates gender and amount parameters using express-validator.
 */
router.post("/dreamDates", [
    body('gender').isIn(['', 'male', 'female']).withMessage('Invalid gender. Must be either "male" or "female"'),
    body('amount').isInt({ min: 1, max: 5000 }).withMessage('Invalid amount. Must be between 1 and 5000'),
    ],
    dreamDates.getDreamDates);

export default router;