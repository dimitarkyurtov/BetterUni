/**
 * Created by adminuser on 4/22/2017.
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let commentSchema = mongoose.Schema({
    comment: {type: String, required: true},
    author:{type: ObjectId, ref: 'User'}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

