const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = Schema({
  username: {type:String,required:[true, 'Please enter your name']},
  email:    {type:String,required:[true, 'Please enter your email']},
  password: {type:String,required:[true, 'Please enter your password']},
  profile_pic: {
    pic_path:{
        type: String,
        default: "https://365randommuppets.files.wordpress.com/2014/09/266-beaker1.jpg?w=1200",
        required: [true, 'Please enter path avatar']
      },
    pic_name:{
        type: String,
        default: "Profile Picture",
        required: [true, 'Please enter avatar name']
      },
    }
  }, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;
