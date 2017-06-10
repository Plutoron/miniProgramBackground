// User model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = new Schema({
  openid: { type: String, required: '`openid`是必填' },
  nickName: { type: String, required: '`nickName`是必填' },
  city: { type: String, default: 'null'}
});

User.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', User);

