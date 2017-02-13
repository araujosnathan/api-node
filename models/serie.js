
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var serieSchema = new Schema({
  name:String,
  year:String,
  season:String,
  genre:String,
});

module.exports = mongoose.model('Serie', serieSchema)
