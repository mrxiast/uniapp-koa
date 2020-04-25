const Router = require('koa-router')
const { Comment } = require('../../models/comment')
const { CommentValidtor } = require('../../validators/validator')
const Auth = require('../../../middlewares/auth')
const Uuid = require('uuid')
const success = require('../lib/helper')

const router = new Router({
    prefix: '/v1/comment'
})

router.get('/getComment', async (ctx, next) => {
    const id = ctx.query.id
    console.log(id, 'id')
    const comments = await Comment.getComments(id)
    ctx.body = {
        code: 200,
        data: comments,
        msg: '操作成功'
    }
})

router.post('/addComment', new Auth().m, async (ctx, next) => {
    const v = await new CommentValidtor().validate(ctx)

    const data = {
        id: Uuid.v1(),
        ava_url: v.get('body.ava_url'),
        nick_name: v.get('body.nick_name'),
        type: v.get('body.type'),
        art_id: v.get('body.art_id'),
        content: v.get('body.content')
    }
    const result = await Comment.addComment(data)
    if (!result) {
        throw new global.errs.ParameterException()
    } else {
        success()
    }
})

module.exports = router