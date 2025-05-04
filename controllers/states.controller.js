const State = require("../models/States");
const fs = require("fs");
const path = require("path");

// Use native __dirname in CommonJS
const statesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/statesData.json')));

// Helper function
function getFunFacts(statesDb) {
    const funFacts = {};
    statesDb.forEach((state) => {
        if (state?.funfacts?.length) {
            funFacts[state.stateCode] = state.funfacts;
        }
    });
    return funFacts;
}

const getStateController = (req, res) => {
    if (req.query.contig === 'true') {
        getContiguousStates(req, res);
    } else if (req.query.contig === 'false') {
        getNonContiguousStates(req, res);
    } else {
        getAllStates(req, res);
    }
};

const getAllStates = async (req, res) => {
    try {
        const statesDb = await State.find();
        const funFacts = getFunFacts(statesDb);
        const states = statesData.map(state => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        });
        res.status(200).json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getContiguousStates = async (req, res) => {
    try {
        const statesDb = await State.find();
        const funFacts = getFunFacts(statesDb);
        const filteredStates = statesData.filter(state => state.code !== "AK" && state.code !== "HI");
        const contiguousStates = filteredStates.map(state => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        });
        res.status(200).json(contiguousStates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getNonContiguousStates = async (req, res) => {
    try {
        const statesDb = await State.find();
        const funFacts = getFunFacts(statesDb);
        const filteredStates = statesData.filter(state => state.code === "AK" || state.code === "HI");
        const nonContiguousStates = filteredStates.map(state => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        });
        res.status(200).json(nonContiguousStates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getState = async (req, res) => {
    try {
        const code = req.code;
        const state = statesData.find(state => state.code === code);
        if (!state) return res.status(404).json({ message: "Invalid state code" });

        const statesDb = await State.findOne({ stateCode: code });
        if (statesDb?.funfacts?.length) {
            state.funfacts = statesDb.funfacts;
        }
        res.status(200).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getStateFunFact = async (req, res) => {
    try {
        const code = req.code;
        const statesDb = await State.findOne({ stateCode: code });
        if (!statesDb?.funfacts?.length) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }
        const randomFunFact = statesDb.funfacts[Math.floor(Math.random() * statesDb.funfacts.length)];
        res.status(200).json({ funfact: randomFunFact });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getStateCapital = (req, res) => {
    try {
        const code = req.code;
        const state = statesData.find(state => state.code === code);
        if (!state) return res.status(404).json({ message: "Invalid state code" });
        res.status(200).json({ state: state.state, capital: state.capital_city });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getStateNickname = (req, res) => {
    try {
        const code = req.code;
        const state = statesData.find(state => state.code === code);
        if (!state) return res.status(404).json({ message: "Invalid state code" });
        res.status(200).json({ state: state.state, nickname: state.nickname });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getStatePopulation = (req, res) => {
    try {
        const code = req.code;
        const state = statesData.find(state => state.code === code);
        if (!state) return res.status(404).json({ message: "Invalid state code" });
        res.status(200).json({ state: state.state, population: state.population });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getStateAdmission = (req, res) => {
    try {
        const code = req.code;
        const state = statesData.find(state => state.code === code);
        if (!state) return res.status(404).json({ message: "Invalid state code" });
        res.status(200).json({ state: state.state, admitted: state.admission_date });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const createStateFunFacts = async (req, res) => {
    try {
        const code = req.code;
        const { funfacts } = req.body;
        if (!Array.isArray(funfacts)) {
            return res.status(400).json({ message: "Fun facts must be an array." });
        }

        const existingState = await State.findOne({ stateCode: code });
        if (!existingState) {
            return res.status(404).json({ message: "No state found to update" });
        }

        if (funfacts.length === 0) {
            return res.status(200).json(existingState);
        }

        const updatedState = await State.findOneAndUpdate(
            { stateCode: code },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true }
        );

        res.status(201).json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateStateFunFact = async (req, res) => {
    try {
        const code = req.code;
        const { index, funfact } = req.body;

        if (!index) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        if (!funfact || typeof funfact !== 'string' || funfact.trim().length === 0) {
            return res.status(400).json({ message: "State fun fact value must be a non-empty string" });
        }

        const stateDb = await State.findOne({ stateCode: code });
        if (!stateDb) return res.status(404).json({ message: "No state found to update" });

        if (!Array.isArray(stateDb.funfacts) || stateDb.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }

        const factIndex = index - 1;
        if (factIndex < 0 || factIndex >= stateDb.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
        }

        stateDb.funfacts[factIndex] = funfact.trim();
        const updated = await stateDb.save();
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteStateFunFact = async (req, res) => {
    try {
        const code = req.code;
        const { index } = req.body;

        if (!index) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        const stateDb = await State.findOne({ stateCode: code });
        if (!stateDb) {
            return res.status(404).json({ message: "No state found to delete fun fact from" });
        }

        if (!Array.isArray(stateDb.funfacts) || stateDb.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }

        const factIndex = index - 1;
        if (factIndex < 0 || factIndex >= stateDb.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
        }

        stateDb.funfacts.splice(factIndex, 1);
        const updated = await stateDb.save();

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getStateController,
    getState,
    getStateFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    createStateFunFacts,
    updateStateFunFact,
    deleteStateFunFact
};
