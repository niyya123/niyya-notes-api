const auth = require('../api/middlewares/auth')
var Todos = require('../api/models/todoModel')

module.exports = function (app) {

    // get Todos
    app.get('/api/todos', auth, function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 8;
        Todos.find().skip((page - 1) * pageSize).limit(pageSize).then(async todo => {
            const totalItems = await Todos.countDocuments();
            const totalPages = Math.ceil(totalItems / pageSize);
            res.json({
                "page": page,
                "pageSize": pageSize,
                "totalItems": totalItems,
                "totalPages": totalPages,
                "todos": todo
            })
        }).catch(err => {
            throw err;
        })
    })

    //search todos
    app.get('/api/todos/search', auth, function (req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 8;

        const { title, isDone, author, createdAt, endDate, text } = req.query;
        let query = {};
        if (title) {
            query.title = title // Case-insensitive search
        }
        if (author) {
            query.author = author; // Case-insensitive search
        }
        if (isDone) {
            query.isDone = isDone; // Case-insensitive search
        }
        if (createdAt) {
            query.createdAt = createdAt // Case-insensitive search
        }
        if (endDate) {
            query.endDate = endDate; // Case-insensitive search
        }
        if (text) {
            query.text = text // Case-insensitive search
        }

        console.log(req.body)

        Todos.find(query).skip((page - 1) * pageSize).limit(pageSize).then(async todo => {
            const totalItems = await Todos.countDocuments();
            const totalPages = Math.ceil(totalItems / pageSize);
            res.json({
                "page": page,
                "pageSize": pageSize,
                "totalItems": totalItems,
                "totalPages": totalPages,
                "todos": todo
            })
        }).catch(err => {
            throw err;
        })
    })

    // get 1 todo
    app.get('/api/todos/:id', auth, function (req, res, next) {
        Todos.findById({ _id: req.params.id }).then(todo => {
            res.json(todo);
        }).catch(err => {
            throw err;
        })
    })

    // create todo
    app.post('/api/todos', auth, function (req, res, next) {
        if (req.body.title == null) {
            res.status(404).json({
                message: 'Thiếu thông tin title'
            });
        } else
            Todos.create(req.body).then(todo => {
                res.json({
                    message: 'Tạo mới thành công',
                    code: 200,
                    todo: todo
                });
            }).catch(err => {
                throw err;
            })
    })

    //update todo
    app.put('/api/todos/:id', auth, function (req, res, next) {
        Todos.findByIdAndUpdate({ _id: req.params.id }, req.body).then(todo => {
            res.json({
                message: 'Cập nhật thành công',
                code: 200,
            });
        }).catch(err => {
            throw err;
        })
    })

    //update todo status
    app.put('/api/todos/changeStatus/:id', auth, function (req, res, next) {
        Todos.findByIdAndUpdate({ _id: req.params.id }, {
            isDone: req.body.isDone
        }, { new: true, runValidators: true }).then(todo => {
            res.json({
                message: 'Cập nhật trạng thái thành công',
                code: 200,
                todo: todo
            });
        }).catch(err => {
            throw err;
        })
    })

    //delete todo
    app.delete('/api/todos/:id', function (req, res, next) {
        Todos.findByIdAndDelete({ _id: req.params.id }).then(todo => {
            res.json({
                message: 'Xóa thành công',
                code: 200,
            });
        }).catch(err => {
            throw err;
        })
    })
}