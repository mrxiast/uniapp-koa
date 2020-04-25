const Router = require('koa-router')
const { ValidationInteger } = require('../../validators/validator')
const { Book } = require('../../models/classic')
const { Favorite } = require('../../models/favorite')
const Auth = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/book'
})

router.get('/getList', async (ctx, next) => {
    const pageSize = ctx.query.pageSize
    const pageNum = ctx.query.pageNum

    const arts = await Book.getBookList(pageNum, pageSize)
    ctx.body = {
        code: 200,
        data: arts,
        msg: '操作成功'
    }
})

router.get('/getBookInfo', new Auth().m, async (ctx, next) => {
    const v = await new ValidationInteger().validate(ctx)
    const id = v.get('query.id')
    const result = await Book.getBookInfo(id)
    const isLike = await Favorite.getIsZan(300, id, ctx.auth.uid)
    result.setDataValue('isLike', isLike)
    ctx.body = {
        code: 200,
        data: result,
        msg: '操作成功'
    }
})

router.get('/searchBook', async (ctx, next) => {
    const name = ctx.query.name
    const books = await Book.searchBook(name)
    ctx.body = {
        code: 200,
        data: books,
        msg: '操作成功'
    }
})


module.exports = router