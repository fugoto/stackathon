const Sequelize = require("sequelize") //for things like Sequelize.STRING
//import your db
const { db } = require('../db')
const { STRING } = Sequelize
//define your model
const Example = db.define('example', {
    name: {
        type: STRING
    }
})
//define any class or instance methods

//export your model
module.exports = { Example }