var configValues = require('./config.json')

module.exports ={
    getDbConnectionString:function(){
        return `mongodb+srv://${configValues.username}:${configValues.password}%40@cluster0.huynvld.mongodb.net/`
    }
}