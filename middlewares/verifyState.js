import statesData from "../data/statesData.json" assert { type: 'json' };

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
