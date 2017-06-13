// Song model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Song = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: '`user`必填字段' },
  id: { type: String, required: '`id`是必填'},
  poster: { type: String, required: '`poster`是必填'},
  name: { type: String, required: '`name`是必填' },
  author: { type: String, default: ''}
});

Song.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Song', Song);

