// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Base = new Schema({
  songposter: { type: String, required: '`songposter`是必填'},
  songname: { type: String, required: '`songname`是必填' },
  songauthor: { type: String, default: ''},
  songurl: { type: String, required: '`songurl`是必填'}
});

Base.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Base', Base);

