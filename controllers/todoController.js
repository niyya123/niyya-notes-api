const auth = require('../api/middlewares/auth')
var Todos = require('../api/models/todoModel')

module.exports = function(app){

    // get Todos
    app.get('/api/todos',auth, function(req, res, next) {
        Todos.find().then(todo=>{
            res.json(todo)
        }).catch(err=>{
            throw err;
        })
    })

    // get 1 todo
    app.get('/api/todos/:id',auth, function(req, res, next) {
        Todos.findById({_id:req.params.id}).then(todo=>{
            res.json(todo);
        }).catch(err=>{
            throw err;
        })
    })

    // create todo
    app.post('/api/todos',auth, function(req, res, next) {
        if(req.body.title == null){
            res.status(404).json({
                message:'Thiếu thông tin title'
            });
        }else
        Todos.create(req.body).then(todo=>{
            res.json({
                message:'Tạo mới thành công',
                code: 200,
                todo: todo
            });
        }).catch(err=>{
            throw err;
        })
    })

    //update todo
    app.put('/api/todos/:id',auth, function(req, res, next) {
        Todos.findByIdAndUpdate({_id: req.params.id}, req.body).then(todo=>{
            res.json({
                message:'Cập nhật thành công',
                code: 200,
            });
        }).catch(err=>{
            throw err;
        })
    })

    //delete todo
    app.delete('/api/todos/:id', function(req, res, next) {
        Todos.findByIdAndDelete({_id: req.params.id}).then(todo=>{
            res.json({
                message:'Xóa thành công',
                code: 200,
            });
        }).catch(err=>{
            throw err;
        })
    })
}