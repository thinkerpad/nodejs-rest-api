import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./data/mongoDb.js";
import stateRouter from "./routes/states.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({path: '.env'});
const port = process.env.PORT;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

app.get(/^\/$|\/index(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/states', stateRouter);

app.all(/(.*)/, (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await connectToDatabase();
});