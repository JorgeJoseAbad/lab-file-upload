const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const comentSchema = new Schema({
  content: String,
  authorId: {
              type: Schema.Types.ObjectId,
              ref: 'User', //ref user is mandatory
              required: true
            },//- ObjectId of the coment's creator
  }, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

const Coment = mongoose.model('Coment', comentSchema);

module.exports = Coment;
