const mongoose = require('mongoose');

module.exports = mongoose.model('Devices', new mongoose.Schema({
  id: String,
  name: String,
  user: String,
  sensorData: Array,
  role : String,
}, { collection : 'SB' }));