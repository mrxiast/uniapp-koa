const { sequelize } = require('../../core/db')

const { Sequelize, Model, Op } = require('sequelize')

const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: Sequelize.INTEGER,
    title: Sequelize.STRING,
    type: Sequelize.INTEGER,
    author: Sequelize.STRING
}








class Movie extends Model {

}
Movie.init(classicFields, {
    sequelize,
    tableName: 'movie'
})








class Book extends Model {

    static async getBookList (num, size) {
        let pageNum = num || 1
        let pageSize = size || 10
        const filtter = {
            //limit每页数据数量
            limit: parseInt(pageSize),
            //offet去掉前多少个数据
            offset: (pageNum - 1) * pageSize,
            order: [
                ['id', 'desc']
            ],
            where: {

            }
        }
        const books = await Book.findAndCountAll(filtter)
        return books
    }

    static async getBookInfo (id) {
        const filter = {
            where: {
                id
            }
        }
        const bookInfo = await Book.findOne(filter)
        return bookInfo
    }

    static async searchBook (name) {
        const filtter = {
            raw: true,
            order: [
                ['id', 'DESC']
            ],  // 排序
            where: {
                // name: 'cheny', // 精确查询
                title: {
                    // 模糊查询
                    [Op.like]: '%' + name + '%'
                }
            },
            //  attributes:['id','name'] // 控制查询字段
        }
        const books = await Book.findAll(filtter)
        return books
    }
}
Book.init(classicFields, {
    sequelize,
    tableName: 'book'
})





const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields)
class Music extends Model {

}
Music.init(
    musicFields, {
    sequelize,
    tableName: 'music'
})


class Curriculum extends Model {
    static async getCurriculumList () {
        const curriculums = await Curriculum.findAll()
        return curriculums
    }
}
Curriculum.init(classicFields, {
    sequelize,
    tableName: 'curriculum'
})




module.exports = {
    Movie,
    Book,
    Music,
    Curriculum
}