import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_PATH = "https://randomuser.me/api";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function formatBirthday(birthday) {
    const date = new Date(birthday);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

app.get("/", async (req, res) => {
    // Display button to generate users, list box to select gender, and element to select amount.
    try {
        const result = await axios.get(API_PATH);
        var dobs = [];
        result.data.results.forEach(res => {
            dobs.push(formatBirthday(res.dob.date));
        });
        res.render("index.ejs", {
            results: result.data.results,
            bDays: dobs
        });
    } catch (error) {
        console.error(`Got error from server: ${error.response.data.error}`)
    }
});

app.post("/", async (req, res) => {
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
            results: result.data.results,
            bDays: dobs
        });
    } catch (error) {
        console.error(`Got error from server: ${error.response.data.error}`)
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});