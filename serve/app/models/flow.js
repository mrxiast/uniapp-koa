const {sequelize} = require('../../core/db')

const {Sequelize,Model} = require('sequelize') 

class Flow extends Model{

}

Flow.init({
    index:Sequelize.INTEGER,
    artid:Sequelize.STRING,
    type:Sequelize.INTEGER
},{
    sequelize,
    tableName:'flow'
})

module.exports = {Flow}