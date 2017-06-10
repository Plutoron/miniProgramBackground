// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Base = new Schema({
  id: { type: String, required: '`id`是必填'},
  poster: { type: String, required: '`poster`是必填'},
  name: { type: String, required: '`name`是必填' },
  author: { type: String, default: ''}
});

Base.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Base', Base);

