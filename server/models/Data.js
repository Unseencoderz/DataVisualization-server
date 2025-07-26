const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  intensity: Number,
  likelihood: Number,
  relevance: Number,
  year: Number,
  country: String,
  topics: [String],
  region: String,
  city: String,
  pest: String,
  source: String,
  swot: String,
  sector: String,
  end_year: Number,
});

module.exports = mongoose.model('data', DataSchema, "jsondata");
