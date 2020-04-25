const { sequelize } = require('../../core/db')

const { Sequelize, Model, Op } = require('sequelize')


class Comment extends Model {
    static async getComments (id) {
        const filtter = {
            order: [
                ["created_at", 'DESC']
            ],
            where: {

                art_id: id
            }
        }
        const comments = await Comment.findAll(filtter)
        return comments
    }

    static async addComment (data) {
        const result = await Comment.create({
            id: data.id,
            ava_url: data.ava_url,
            nick_name: data.nick_name,
            type: data.type,
            art_id: data.art_id,
            content: data.content
        })
        if (!result) {
            return false
        } else {
            return true
        }
    }
}

Comment.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true,//设置为主键
    },
    ava_url: Sequelize.STRING(500),
    nick_name: Sequelize.STRING(128),
    type: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    content: Sequelize.STRING(200)
}, {
    sequelize,
    tableName: "comment"
})

module.exports = { Comment }