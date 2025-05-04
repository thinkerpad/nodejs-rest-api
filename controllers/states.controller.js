import State from "../models/States.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../data/statesData.json'));
const statesData = JSON.parse(rawData);

// Helper function
function getFunFacts (statesDb) {
    const funFacts = {};
    statesDb.forEach((state) => {
        if (state?.funfacts?.length) {
            funFacts[state.stateCode] = state.funfacts;
        }
    })

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
}

// ** Don't forget to implement error handling function
const getAllStates = async (req, res) => {
    try {
        // States data from MongoDB
        const statesDb = await State.find();

        const funFacts = getFunFacts(statesDb);

        // Structure new states array that includes fun facts (if available) for each state
        const states = statesData.map((state) => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        })

        res.status(200).json(states);
        console.log('Returned all 50 states');
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getContiguousStates = async (req, res) => {
    try {
        // States data from MongoDB
        const statesDb = await State.find();

        const funFacts = getFunFacts(statesDb);

        // Filter to exclude Alaska and Hawaii
        const filteredStates = statesData.filter((state) => state.code !== "AK" && state.code !== "HI");

        // Structure new states array that includes fun facts (if available) for each state
        const contiguousStates = filteredStates.map((state) => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        });

        res.status(200).json(contiguousStates);
        console.log('Returned 48 states, excluding Alaska and Hawaii');
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getNonContiguousStates = async (req, res) => {
    try {
        // States data from MongoDB
        const statesDb = await State.find();

        const funFacts = getFunFacts(statesDb);

        // Filter to only include Alaska and Hawaii
        const filteredStates = statesData.filter((state) => state.code === "AK" || state.code === "HI");

        // Structure new states array that includes fun facts (if available) for each state
        const nonContiguousStates = filteredStates.map((state) => {
            const funfacts = funFacts[state.code];
            return funfacts ? { ...state, funfacts } : state;
        });

        res.status(200).json(nonContiguousStates);
        console.log('Returned 2 states, only Alaska and Hawaii');
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getState = async (req, res) => {
    try {
        const code = req.code;

        const state = statesData.find((state) => state.code === code);

        if (!state) {
            return res.status(404).json({ message: "Invalid state code" });
        }

        // States data from MongoDB
        const statesDb = await State.findOne({ stateCode: code });

        // Add funfacts if found in DB
        if (statesDb?.funfacts?.length) {
            state.funfacts = statesDb.funfacts;
        }

        res.status(200).json(state);
        console.log(`Returned ${code} state`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getStateFunFact = async (req, res) => {
    try {
        const code = req.code;

        // States data from MongoDB
        const statesDb = await State.findOne({ stateCode: code });

        if (!statesDb?.funfacts?.length) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }

        const randomFunFact = statesDb.funfacts[Math.floor(Math.random() * statesDb.funfacts.length)];

        res.status(200).json({funfact: randomFunFact});
        console.log(`Returned random fun fact for ${code} state\nFun fact: ${randomFunFact}`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

const getStateCapital = (req, res) => {
    try {
        const code = req.code;

        const state = statesData.find((state) => state.code === code);

        if (!state) {
            return res.status(404).json({ message: "Invalid state code" });
        }

        res.status(200).json({state: state.state, capital: state.capital_city});
        console.log(`Returned capital city for ${code} state\nCapital: ${state.capital_city}`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getStateNickname = (req, res) => {
    try {
        const code = req.code;

        const state = statesData.find((state) => state.code === code);

        if (!state) {
            return res.status(404).json({ message: "Invalid state code" });
        }

        res.status(200).json({state: state.state, nickname: state.nickname});
        console.log(`Returned nickname for ${code} state\nNickname: ${state.nickname}`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getStatePopulation = (req, res) => {
    try {
        const code = req.code;

        const state = statesData.find((state) => state.code === code);

        if (!state) {
            return res.status(404).json({ message: "Invalid state code" });
        }

        res.status(200).json({state: state.state, population: state.population});
        console.log(`Returned population for ${code} state\nPopulation: ${state.population}`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getStateAdmission = (req, res) => {
    try {
        const code = req.code;

        const state = statesData.find((state) => state.code === code);

        if (!state) {
            return res.status(404).json({ message: "Invalid state code" });
        }

        res.status(200).json({state: state.state, admitted: state.admission_date});
        console.log(`Returned admission date for ${code} state\nAdmission Date: ${state.admission_date}`);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const createStateFunFacts = async (req, res) => {
    try {
        const code = req.code;
        const { funfacts } = req.body;

        // Validate input
        if (!Array.isArray(funfacts)) {
            return res.status(400).json({ message: "Fun facts must be an array." });
        }

        // Check if state document exists
        const existingState = await State.findOne({ stateCode: code });
        if (!existingState) {
            return res.status(404).json({ message: "No state found to update" });
        }

        // If no funfacts to add, return existing state data
        if (funfacts.length === 0) {
            return res.status(200).json(existingState);
        }

        // Append new funfacts
        const updatedState = await State.findOneAndUpdate(
            { stateCode: code },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true }
        );

        res.status(201).json(updatedState);
        console.log(`Added fun facts to ${code} state`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateStateFunFact = async (req, res) => {
    try {
        const code = req.code;
        const { index, funfact } = req.body;

        // Validate inputs
        if (!index) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        if (!funfact || typeof funfact !== 'string' || funfact.trim().length === 0) {
            return res.status(400).json({ message: "State fun fact value must be a non-empty string" });
        }

        // Get state document
        const stateDb = await State.findOne({ stateCode: code });
        if (!stateDb) {
            return res.status(404).json({ message: "No state found to update" });
        }

        if (!Array.isArray(stateDb.funfacts) || stateDb.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }

        // Adjust for 1-based index from request body
        const factIndex = index - 1;

        if (factIndex < 0 || factIndex >= stateDb.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
        }

        // Update the fun fact
        stateDb.funfacts[factIndex] = funfact.trim();
        const updated = await stateDb.save();

        res.status(200).json(updated);
        console.log(`Updated fun fact #${index} for ${code}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteStateFunFact = async (req, res) => {
    try {
        const code = req.code;
        const { index } = req.body;

        // Validate index
        if (!index) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        // Get state document
        const stateDb = await State.findOne({ stateCode: code });
        if (!stateDb) {
            return res.status(404).json({ message: "No state found to delete fun fact from" });
        }

        if (!Array.isArray(stateDb.funfacts) || stateDb.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${code}` });
        }

        // Adjust index (1-based to 0-based)
        const factIndex = index - 1;

        if (factIndex < 0 || factIndex >= stateDb.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${code}` });
        }

        // Remove the fun fact at the given index
        stateDb.funfacts.splice(factIndex, 1);
        const updated = await stateDb.save();

        res.status(200).json(updated);
        console.log(`Deleted fun fact #${index} from ${code}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export { 
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