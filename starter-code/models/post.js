const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = Schema({
  content: String,// Text belonging to the post
  creatorId: {
              type: Schema.Types.ObjectId,
              ref: 'User', //ref user is mandatory
              required: true
            },//- ObjectId of the post's creator
  picPath: String,// - Where the picture is stored
  picName: String,// - The picture's name
  }, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
