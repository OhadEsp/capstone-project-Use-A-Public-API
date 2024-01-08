import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { body, validationResult } from "express-validator";
import morgan from "morgan";

dotenv.config({path: './config.env'});

const app = express();
const port = process.env.PORT || 3000;
const API_PATH = process.env.API_PATH;

// Middleware to parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * Formats the given birthday string to the format DD/MM/YYYY.
 * @param {string} birthday - The birthday string to be formatted.
 * @returns {string} The formatted birthday string.
 */
function formatBirthday(birthday) {
    const date = new Date(birthday);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Route to render the home page.
 */
app.get("/", (req, res) => {
    res.render("index.ejs", {
        ejsContent: "homePage.ejs"
    });
});

/**
 * Route to display the dates generator page and fetch random user data.
 */
app.get("/dreamDates", async (req, res) => {
    // Display button to generate users, list box to select gender, and element to select amount.
    try {
        const result = await axios.get(API_PATH);
        var dobs = [];
        result.data.results.forEach(res => {
            dobs.push(formatBirthday(res.dob.date));
        });
        res.render("index.ejs", {
            ejsContent: "datesGeneratorPage.ejs",
            results: result.data.results,
            bDays: dobs
        });
    } catch (error) {
        console.error(`Got error from server: ${error.response.data.error}`)
    }
});

/**
 * Route to handle form submission for generating dream dates.
 * Validates gender and amount parameters using express-validator.
 */
app.post("/dreamDates", [
    body('gender').isIn(['', 'male', 'female']).withMessage('Invalid gender. Must be either "male" or "female"'),
    body('amount').isInt({ min: 1, max: 5000 }).withMessage('Invalid amount. Must be between 1 and 5000'),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        var queryParams = '';
        const gender = req.body.gender;
        const amount = req.body.amount;
        const nonEmptyValues = [];
        var apiPath = API_PATH;
        if (gender && gender.trim() !== '') {
            nonEmptyValues.push(`gender=${gender}`);
        }
        if (amount && amount.trim() !== '') {
            nonEmptyValues.push(`results=${amount}`);
        }
        if (nonEmptyValues.length > 0) {
            queryParams = nonEmptyValues.join('&');
            apiPath = `${apiPath}?${queryParams}`;
        }

        try {
            const result = await axios.get(apiPath);
            var dobs = [];
            result.data.results.forEach(res => {
                dobs.push(formatBirthday(res.dob.date));
            });
            res.render("index.ejs", {
                ejsContent: "datesGeneratorPage.ejs",
                results: result.data.results,
                bDays: dobs
            });
        } catch (error) {
            console.error(`Got error from server: ${error.response.data.error}`)
        }
});

/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});