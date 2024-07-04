var Todos = require('../api/models/todoModel')

module.exports = function (app) {
    app.get("/api/setupTodos", function(req, res, next) {
        var dummyTodos = [
            {
                author: 'Niyya',
                text: 'test1',
                isDone : false,
                createdAt: 20240702,
                endDate: 20240703,
                color: 'red',
                title:'TEST 1'
            },
            {
                author: 'Niyya',
                text: 'test2',
                isDone : true,
                createdAt: 20240702,
                endDate: 20240703,
                color: 'green',
                title:'TEST 2'
            },   {
                author: 'Niyya',
                text: 'test3',
                isDone : false,
                createdAt: 20240702,
                endDate: 20240703,
                color: 'yellow',
                title:'TEST 3'
            },
        ]

        Todos.create(dummyTodos).then(note => {
            console.log('Tạo note thành công:', note);
        })
        .catch(error => {
            console.error('Tạo note thất bại:', error);
        });
    })
}