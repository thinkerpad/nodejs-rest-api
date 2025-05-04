import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../data/statesData.json'));
const statesData = JSON.parse(rawData);

const stateCodes = statesData.map(state => state.code); // ['AL', 'AK', ...]

const verifyState = (req, res, next) => {
    const code = req.params.state?.toUpperCase();

    if (!stateCodes.includes(code)) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }

    req.code = code; // Attach normalized state code
    next();
};

export default verifyState;
