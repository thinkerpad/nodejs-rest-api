const fs = require('fs');
const path = require('path');

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

module.exports = verifyState;
