// Song model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Song = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: '`user`必填字段' },
  poster: { type: String, required: '`songposter`是必填'},
  name: { type: String, required: '`songname`是必填' },
  author: { type: String, default: '`songauthor`是必填'},
  url: { type: String, required: ''}
});

Song.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Song', Song);

