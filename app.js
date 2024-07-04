var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');

var config = require('./config');
var setupController = require('./controllers/setupController');
var todoController = require('./controllers/todoController');

var app = express();
app.use(cors());
var port = process.env.PORT || 3000

app.use("/assets", express.static(__dirname+ "/public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"))

app.set("view engine", "ejs");

//Db info
console.log(config.getDbConnectionString())
mongoose.connect(config.getDbConnectionString())
setupController(app)
todoController(app)

app.get("/", function(req, res){
    res.render("index");
})

app.listen(port,function(){
    console.log("Server running on port", port);
});