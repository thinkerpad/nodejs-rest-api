const express = require("express");
const {
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
} = require("../controllers/states.controller");
const verifyState = require("../middlewares/verifyState");

const stateRouter = express.Router();

stateRouter.get("/", getStateController);
stateRouter.get("/:state", verifyState, getState);
stateRouter.get("/:state/funfact", verifyState, getStateFunFact);
stateRouter.get("/:state/capital", verifyState, getStateCapital);
stateRouter.get("/:state/nickname", verifyState, getStateNickname);
stateRouter.get("/:state/population", verifyState, getStatePopulation);
stateRouter.get("/:state/admission", verifyState, getStateAdmission);

stateRouter.post("/:state/funfact", verifyState, createStateFunFacts);
stateRouter.patch("/:state/funfact", verifyState, updateStateFunFact);
stateRouter.delete("/:state/funfact", verifyState, deleteStateFunFact);

module.exports = stateRouter;
