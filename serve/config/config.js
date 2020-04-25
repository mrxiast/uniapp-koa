module.exports = {
    env:'dev',
    database:{
        dbName:'test',
        host:'localhost',
        port:'3306',
        user:'root',
        password:'Xia199208.'
    },
    security:{
        secretKey:'aabbcdfz',
        expiresIn:60*60*2
    },
    wx:{
        loginUrl : 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
        appId: 'wx6e06eeb60ab7f885',
        secret : '1a488afe8f2fec820263ee2d9ae3718e'
    }
}