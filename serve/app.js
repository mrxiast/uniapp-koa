const Koa = require('koa')

const koaBody = require('koa-bodyparser')

const catchError = require('./middlewares/exception.js')



require('./app/models/user.js')

const app =new Koa()


//必须先写body中间件
app.use(koaBody())
app.use(catchError)

//初始化的工具类 自动导入api下所有路由并注册
const InitManger = require('./core/init.js')
InitManger.initApp(app)




app.listen(3333,function(){
    console.log('3333起了')
})