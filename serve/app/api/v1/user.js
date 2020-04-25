
const Router = require('koa-router')
const { User } = require('../../models/user')
const { RegisterValitor } = require('../../validators/validator')
const success = require('../lib/helper')

const router = new Router({
    prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
    const V = await new RegisterValitor().validate(ctx)

    const userInfo = {
        username: V.get('body.username'),
        email: V.get('body.email'),
        password: V.get('body.password1'),
        phone: V.get('body.phone'),
        openid: V.get('body.openid')
    }
    const result = await User.create(userInfo)
    success()
})

module.exports = router