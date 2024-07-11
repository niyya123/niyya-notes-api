const auth = require('../api/middlewares/auth')
var Messages = require('../api/models/messageModel')

module.exports = function (app) {
      // get Messages
      app.get('/api/chat/messages', auth, function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        Messages.find().skip((page - 1) * pageSize).limit(pageSize).then(async message => {
            const totalItems = await Messages.countDocuments();
            const totalPages = Math.ceil(totalItems / pageSize);
            res.json({
                "code":200,
                "page": page,
                "pageSize": pageSize,
                "totalItems": totalItems,
                "totalPages": totalPages,
                "messages": message
            })
        }).catch(err => {
            throw err;
        })
    })

    //search messages
    app.get('/api/chat/messages/search', auth, function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 8;

        const {author, createdAt,text } = req.query;
        let query = {};
        if (author) {
            query.author = author; // Case-insensitive search
        }
        if (createdAt) {
            query.createdAt = createdAt // Case-insensitive search
        }
        if (text) {
            query.text = text // Case-insensitive search
        }

        console.log(req.body)

        Messages.find(query).skip((page - 1) * pageSize).limit(pageSize).then(async message => {
            const totalItems = await Messages.countDocuments();
            const totalPages = Math.ceil(totalItems / pageSize);
            res.json({
                "page": page,
                "pageSize": pageSize,
                "totalItems": totalItems,
                "totalPages": totalPages,
                "messages": message
            })
        }).catch(err => {
            throw err;
        })
    })

    // create messages
     app.post('/api/chat/messages', auth, async function (req, res, next) {
        if (req.body.author == null) {
            res.status(404).json({
                message: 'Thiếu thông tin người gửi'
            });
        } else{
            let count = await Messages.countDocuments();
            let data = {
                author: req.body.author,
                text: req.body.text,
                createdAt: req.body.createdAt,
                index : count + 1,
            }
                Messages.create(data).then(message => {
                    res.json({
                        message: 'Gửi tin nhắn thành công',
                        code: 200,
                        messageInfo: message
                    });
                }).catch(err => {
                    throw err;
                })
        }
    })
}