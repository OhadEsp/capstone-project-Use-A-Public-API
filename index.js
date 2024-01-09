import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import homePage from "./routes/homePage.js";
import dreamDates from "./routes/dreamDates.js"

dotenv.config({path: './config.env'});

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(homePage);

app.use(dreamDates);

/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});