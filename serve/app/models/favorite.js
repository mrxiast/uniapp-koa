const {sequelize} = require('../../core/db')

const {Sequelize,Model,Op} = require('sequelize') 

const {Art} = require('./art')

class Favorite extends Model{

    static async clickFavorite(type,art_id,uid){

        const favorite = await Favorite.findOne({
            where:{
                type,
                art_id,
                uid
            }
        })
        
        if(favorite){
            throw new global.errs.ParameterException('请勿重复收藏')
        }
        //事务
        return sequelize.transaction(async t=>{
           let a =  await Favorite.create({
                uid,
                art_id,
                type    
            },{transaction:t})
            const arts = await Art.getData(art_id,type)
            //自带函数自增加
            await arts.increment('fav_nums',{by:1,transaction:t})

        })
    }

    static async disFavorite(type,art_id,uid){

        const favorite = await Favorite.findOne({
            where:{
                type,
                art_id,
                uid
            }
        })

        if(!favorite){
            throw new global.errs.ParameterException('未收藏，无法取消收藏')
        }

        return sequelize.transaction(async t=> {
            const result = await favorite.destroy({
                force:true,//物理删除
                transaction:t
            })

            const arts = await Art.getData(art_id,type)
            //减一
            await arts.decrement('fav_nums',{by:1,transaction:t})

        })  
       
    }
    static async getIsZan(type,art_id,uid){
            const result = await Favorite.findOne({
                where:{
                    type,
                    art_id,
                    uid
                }
            })
            if(result){
                return true
            }else{
                return false
            }
    }
    static async getList(uid){
        const result = await Favorite.findAll({
            where:{
                uid,
                type:{
                    [Op.not]:400 //不包括type为400的
                }
            }
        })
        if(!result){
            // throw new global.errs.NotFound()
            return []
        }
        return result
    }

}

Favorite.init({
    uid:Sequelize.STRING,
    art_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER
},{
    sequelize,
    tableName:'favorite'
})

module.exports = {
    Favorite
}