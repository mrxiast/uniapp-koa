const { sequelize } = require('../../core/db')

const { Sequelize, Model, Op } = require('sequelize')

const { Movie, Music, Book } = require('./classic')

const { flatten } = require('lodash')

class Art extends Model {

    static async getData (artid, type) {
        let art = null
        let filtter = {
            where: {
                id: artid
            }
        }
        switch (type) {
            case 100:
                art = await Movie.findOne(filtter)
                break;
            case 200:
                art = await Music.findOne(filtter)
                break;
            case 300:
                art = await Book.findOne(filtter)
                break;

            default:
                throw new global.errs.NotFound()
                break;

        }
        return art
    }

    static async getList (favorites) {
        let arts = {
            100: [],
            200: [],
            300: []
        }
        let result = []
        for (let item of favorites) {
            arts[item.type].push(item.art_id)
        }

        for (let key in arts) {
            if (arts[key].length === 0) {
                continue
            }
            result.push(await Art._getList(key * 1, arts[key]))
        }
        return flatten(result)
    }

    static async _getList (type, ids) {
        let sqlList = []
        let fillter = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }
        switch (type) {
            case 100:
                sqlList = await Movie.findAll(fillter)
                break;
            case 200:
                sqlList = await Music.findOne(fillter)
                break;
            case 300:
                sqlList = await Book.findOne(fillter)
                break;

            default:
                throw new global.errs.NotFound()
                break;

        }
        return sqlList
    }
}

Art.init({


}, {
    sequelize,
    tableName: 'art'
})

module.exports = { Art }