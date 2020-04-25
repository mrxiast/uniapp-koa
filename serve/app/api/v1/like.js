const Router = require('koa-router')
const Auth = require('../../../middlewares/auth')
const { LikeValidtor } = require('../../validators/validator')
const { Favorite } = require('../../models/favorite')
const success = require('../lib/helper')
const router = Router({
    prefix: '/v1/like'
})

router.post('/', new Auth().m, async (ctx, next) => {
    const v = await new LikeValidtor().validate(ctx)
    const type = v.get('body.type')
    const art_id = v.get('body.art_id')
    await Favorite.clickFavorite(type, art_id, ctx.auth.uid)
    success()

})

router.post('/dislike', new Auth().m, async (ctx, next) => {
    const v = await new LikeValidtor().validate(ctx)
    const type = v.get('body.type')
    const art_id = v.get('body.art_id')
    await Favorite.disFavorite(type, art_id, ctx.auth.uid)
    success()
})

module.exports = router