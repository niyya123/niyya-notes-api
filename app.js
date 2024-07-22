var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


var config = require('./config');
var setupController = require('./controllers/setupController');
var todoController = require('./controllers/todoController');
var authController = require('./controllers/authController');
var messageController = require('./controllers/messageController');
var imageController = require('./controllers/imageController');

dotenv.config();

var app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origins: ['']
    }
});
app.use(cors());


var port = process.env.PORT || 3000

app.use("/assets", express.static(__dirname + "/public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.set("view engine", "ejs");

//Db info
console.log(config.getDbConnectionString())
mongoose.connect(config.getDbConnectionString())


// Setup route
setupController(app)
todoController(app)
authController(app)
messageController(app)
imageController(app)

// socket setup
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('New chat message send', (msg) => {
        console.log('msg: ', msg);
        io.emit('New chat message send', msg);
    });
    socket.on('New chat message receive', (msg) => {
        console.log('msg: ', msg);
        io.emit('New chat message receive', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Perform any cleanup or notify other clients as needed
    });
});

app.get("/", function (req, res) {
    res.render("index");
})

server.listen(port, function () {
    console.log("Server running on port", port);
});