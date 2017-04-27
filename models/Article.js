/**
 * Created by adminuser on 4/14/2017.
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let articleSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    comments: [{type: ObjectId, required: false, ref: 'Comment'}],
    author: {type: ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    Like: {type: Number, default: 0}
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;