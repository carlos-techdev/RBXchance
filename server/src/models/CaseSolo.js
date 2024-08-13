// Require Dependencies
const mongoose = require("mongoose");
const SchemaTypes = mongoose.SchemaTypes;

// Setup BattlesGame Schema
const CaseSoloSchema = new mongoose.Schema({

  _user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // Provably Fair fields
  privateHash: {
    type: String,
    default: null
  },

  // which cases are in the battle
  case: {
    type: Object
  },

  // case amount pulled for each case
  caseResult: {
    type: Object
  },


  // When game was created
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the new model
const CaseSolo = (module.exports = mongoose.model("CaseSolo", CaseSoloSchema));
