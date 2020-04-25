const Router = require('koa-router')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')

const Auth = require('../../../middlewares/auth')
const { LikeValidtor } = require('../../validators/validator')
const { Favorite } = require('../../models/favorite')
const { Comment } = require('../../models/comment')

const router = new Router({ prefix: '/v1/classic' })

router.get('/last', async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'desc']
        ]
    })
    const allCount = await Flow.findAndCountAll({
        order: [
            ['id', 'desc']
        ],
        limit: 2,
        offset: 2
    })
    const art = await Art.getData(flow.artid, flow.type * 1)
    art.setDataValue('index', flow.index)
    art.setDataValue('allCount', allCount.count)
    ctx.body = {
        code: '200',
        data: art,
        msg: '操作成功'
    }
    // ctx.body = {
    //     code: '403'
    // }
})

router.get('/query', async (ctx, next) => {
    const params = ctx.query.index
    const flow = await Flow.findOne({
        where: {
            index: params
        }
    })
    const art = await Art.getData(flow.artid * 1, flow.type * 1)
    art.setDataValue('index', flow.index)
    ctx.body = {
        code: '200',
        data: art,
        msg: '操作成功'
    }
})

router.get('/zanAllCount', new Auth().m, async (ctx, next) => {
    const v = await new LikeValidtor().validate(ctx)
    const art_id = ctx.query.art_id
    const type = ctx.query.type
    const arts = await Art.getData(art_id * 1, type * 1)
    const isLike = await Favorite.getIsZan(type, art_id, ctx.auth.uid)
    const fav_nums = arts.dataValues.fav_nums
    const data = {
        fav_nums,
        isLike,
    }
    ctx.body = {
        code: '200',
        data: data,
        msg: '操作成功'
    }
})

router.get('/myLikeList', new Auth().m, async (ctx, next) => {
    const favorite = await Favorite.getList(ctx.auth.uid)
    const arts = await Art.getList(favorite)
    ctx.body = {
        code: '200',
        data: arts,
        msg: "请求成功"
    }
})


module.exports = router