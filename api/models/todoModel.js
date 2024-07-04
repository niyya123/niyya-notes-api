var mongoose = require('mongoose')

var Schema = mongoose.Schema

var todoSchema = new Schema({
    author: String,
    text:String,
    isDone : Boolean,
    createdAt: Number,
    endDate: Number,
    color: String,
    title:String
})

var Todos = mongoose.model("Todos", todoSchema)

module.exports = Todos;