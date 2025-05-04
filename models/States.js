import {Schema, model} from "mongoose";

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true,
    },
    funfacts: {
        type: [String]
    }
});

const State = model('State', stateSchema);

export default State;