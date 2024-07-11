var mongoose = require('mongoose')

var Schema = mongoose.Schema

var messageSchema = new Schema({
    author: String,
    text:String,
    createdAt: Number,
    index:Number,
})


var Messages = mongoose.model("Messages", messageSchema)

module.exports = Messages;                     