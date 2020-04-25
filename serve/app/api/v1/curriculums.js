const Router = require('koa-router')
const { Curriculum } = require('../../models/classic')

const router = new Router({
    prefix: '/v1/curriculum'
})

router.get('/getList', async (ctx, next) => {
    const arts = await Curriculum.getCurriculumList()
    ctx.body = {
        code: 200,
        data: arts,
        msg: '操作成功'
    }
})


module.exports = router