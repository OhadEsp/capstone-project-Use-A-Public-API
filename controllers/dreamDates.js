import dotenv from "dotenv";
import axios from "axios";
import { validationResult } from "express-validator";
import { formatBirthday } from "../Utils/dateUtils.js"

dotenv.config({path: './config.env'});

const API_PATH = process.env.API_PATH;


const dreamDates = {
    /**
     * funtion for GET dreamDate route.
     */
    async getRandomDreamDate(req, res) {
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
    },

    /**
     * funtion for POST dreamDate route.
     */
    async getDreamDates(req, res) {
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
    }
}

export default dreamDates;