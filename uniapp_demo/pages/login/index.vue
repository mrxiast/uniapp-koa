<template>
    <view>
        <view v-if="isCanUse==1">
            <view>
                <view class='header'>
                    <image src='../../static/logo.jpg'></image>
                </view>
                <view class='content'>
                    <view>申请获取以下权限</view>
                    <text>获得你的公开信息(昵称，头像、地区等)</text>
                </view>

                <button 
				class='bottom' 
				type='primary' 
				open-type="getUserInfo" 
				withCredentials="true" 
				lang="zh_CN" 
				@getuserinfo="wxGetUserInfo">
                    click me
                </button>
            </view>
        </view>
		<view v-else>已经授权了</view>
		
    </view>

	
	
</template>

<script>
    export default {
        data() {
            return {
                SessionKey: '',
                OpenId: '',
                nickName: null,
                avatarUrl: null,
                isCanUse: uni.getStorageSync('isCanUse')||1//默认为true
            };
        },
		mounted(){
			console.log(this.isCanUse,'123456')
		},
        methods: {
            //第一授权获取用户信息===》按钮触发
            wxGetUserInfo() {
                let _this = this;
                uni.getUserInfo({
                    provider: 'weixin',
                    success: function(infoRes) {
                        let nickName = infoRes.userInfo.nickName; //昵称
                        let avatarUrl = infoRes.userInfo.avatarUrl; //头像
                        try {
                            uni.setStorageSync('isCanUse', 2);//记录是否第一次授权  false:表示不是第一次授权						
                            _this.login()
                        } catch (e) {
							
						}
                    },
                    fail(res) {
						
					}
                });
            },

　　　　　　//登录
                login() {
                let _this = this;
                uni.showLoading({
                    title: '登录中...'
                });
               // 1.wx获取登录用户code
                uni.login({
                    provider: 'weixin',
                    success: function(loginRes) {
                        let code = loginRes.code;
            
                        //2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
                        uni.request({
                            url: 'http://203.195.222.243/v1/token',
                            data: {
                                account: code,
								type:'100'
                            },
                            method: 'POST',
                            // header: {
                            //     'content-type': 'application/json'
                            // },
                            success: (res) => {
                                //openId、或SessionKdy存储//隐藏loading
								if(res.statusCode === 200){
									 uni.setStorageSync('token', res.data.token)
									 console.log(uni.getStorageSync('token'))
									 uni.hideLoading();
									 uni.navigateTo({
									     url: '../home/index'
									 });
								}else{
									
								}
                                
                            }
                        });
                    },
                });
            },
        },
        onLoad() {//默认加载
            
        }
    }
</script>

<style lang="less">
	@import './index.less';
</style>
