import {Base64} from 'js-base64'

export function getBase64 (token) {
    const base64Token = 'Basic ' + Base64.encode(token + ":")
    return base64Token
}

export function get(url,params){
	const method = 'GET'
	return new Promise((resolve,reject)=>{
		_request(url,params,method,resolve,reject)
	})
	
}


function _request(url,params,method,resolve,reject,noRefetch=false){
	uni.request({
		url: url, //仅为示例，并非真实接口地址。
		method:method,
		data:params,
		header: {
			'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
		},
		success: (res) => {
			if(res.statusCode == 200){
				resolve(res)
			}else{
				if(res.statusCode == 403){
					if(!noRefetch){
						_refetch(
						url,
						params,
						resolve,
						reject,
						'GET'
						)
					}
				}
			}
			
		},
		fail:(err) => {
			reject()
			_showErr(err)
		}
	})
}
function _showErr(error_code){
	if(!error_code){
		error_code = 1
	}
	uni.showToast({
		icon:'none',
		title: '请求失败:' + error_code,
		duration: 1500
	})
}

function _refetch(...param){
	console.log(...param,'7755222')
	uni.request({
	    url: 'http://203.195.222.243/v1/token/getToken', //仅为示例，并非真实接口地址。
		method:'POST',
		data:{
			openid: uni.getStorageSync('openid')
		},
	    success: (res) => {
			uni.setStorageSync('token', res.data.token)
			_request(...param,true)
			// this.getZanCount(this.nowStage.type,this.nowStage.id)
	    }
	});
}