<template>
	<view>
		<view class="pageTop" :style="{backgroundImage:`url(${imgUrl})`,backgroundSize: 'cover'}">
			<!-- <img src="../../static/imgs/big.jpg" alt="" /> -->
			
				<view class="clickStudy" @click="aboutUs">
					<img src="../../static/imgs/th.png" alt="">
					<view>关于我们</view>
				</view>
				<view v-if='showAva' class="userInfoImg">
					<img  class="avaImg" :src="avatarUrl" alt="">
					<view class="nickName">{{nickName}}</view>
				</view>
				
				<button
				v-else
				class="avaBox"
				type='primary' 
				open-type="getUserInfo" 
				withCredentials="true" 
				lang="zh_CN" 
				@getuserinfo="getUserInfo">
				    授权登录
				</button>
				
				<view class="clickStudy">
					<img src="../../static/imgs/book.png" alt="">
					<view>喜欢的书</view>
				</view>
				
		</view>
		<view class="studyPic" @click="getStudy">
			<img src="../../static/imgs/study.png" alt="">
		</view>
		
		<view v-if="!showAva" class="textBox">登陆后，才有显示哦~~</view>
		<view class="content" v-else>
			<view class="book-content">
				<view class="contentTitle">
					<view class="txtBox">
							喜欢
					</view>
					
				</view>
				<view v-if="list.length > 0" class="itemBox">
					<view class="bookItem"  v-for="(item,index) in list" :key="index" >
						<view class="bookTops">
							<view class="tags">
								{{item.type === 100 ? '电影' : item.type === 200 ? '音乐' : '书籍'}}
							</view>
							<view class="xin">
								<img src="../../static/imgs/zan1.png" alt="">
								<view class="nums">{{item.fav_nums}}</view>
							</view>
						</view>
						<view class="pic">
							<img :src="item.image" alt="">
						</view>
						<view class="itemTitle">{{item.title}}</view>
					</view>
				</view>
				<view v-else class="noLike">
					还没有喜欢的内容哟！[○･｀Д´･ ○]！
				</view>
				
			</view>
		</view>
	</view>
	
</template>

<script>
	import {Base64} from 'js-base64'
	export default {
		data() {
			return {
				imgUrl:'../../static/imgs/big.jpg',
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl:null,
				isCanUse: "1",//默认为true
				showAva:false,
				list:[],
			}
		},
		onLoad(){
			if(uni.getStorageSync('nickName')){
				this.nickName = uni.getStorageSync('nickName')
				this.avatarUrl = uni.getStorageSync('avatarUrl')
				this.showAva = true
			}
		},
		onShow(){
			this.getLikeList()
		},
		methods: {
			getStudy(){
				uni.navigateTo({
				    url: '/pages/gostudy/gostudy'
				});
				console.log('点击学习’')
			},
			aboutUs(){
				uni.navigateTo({
				    url: '/pages/aboutus/aboutus'
				});
			},
			getUserInfo() {
			    let _this = this;
			    uni.getUserInfo({
			        provider: 'weixin',
			        success: function(infoRes) {
						console.log(infoRes.userInfo.nickName,'7012')//记录是否第一次授权  false:表示不是第一次授权
						uni.setStorageSync('nickName', infoRes.userInfo.nickName)
						uni.setStorageSync('avatarUrl', infoRes.userInfo.avatarUrl)
						_this.showAva = true
						_this.avatarUrl = infoRes.userInfo.avatarUrl
						_this.nickName = infoRes.userInfo.nickName
			             _this.login()
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
						url: 'http://203.195.222.243/v1/token/getOpenid',
						data: {
							account: code,
							type:'100'
						},
						method: 'POST',
						success: (res) => {
							//openId、或SessionKdy存储//隐藏loading
							if(res.statusCode === 200){
								 uni.setStorageSync('openid', res.data.openid)
								 _this.getToken()
							}
							
						}
					});
				},
			});
		},
		getToken(){
			uni.request({
			    url: 'http://203.195.222.243/v1/token/getToken', //仅为示例，并非真实接口地址。
				method:'POST',
				data:{
					openid: uni.getStorageSync('openid')
				},
			    success: (res) => {
					uni.setStorageSync('token', res.data.token)
					uni.hideLoading();
					this.getLikeList()
					// this.getZanCount(this.nowStage.type,this.nowStage.id)
			    }
			});
		},
		getLikeList(){
			if(!uni.getStorageSync('token')) return
			uni.request({
			    url: 'http://203.195.222.243/v1/classic/myLikeList', //仅为示例，并非真实接口地址。
				method:'GET',
			    header: {
			        'Authorization': this._encode() //自定义请求头信息
			    },
			    success: (res) => {
					this.list = res.data.data
					this.allCount = JSON.parse(JSON.stringify(res.data.data)).allCount
					this.nowIndex = JSON.parse(JSON.stringify(res.data.data)).index
					// this.getZanCount(this.nowStage.type,this.nowStage.id)
			    }
			});
		},
		_encode(){
			const token =Base64.encode(uni.getStorageSync('token')+":") 
			const base64 = 'Basic ' + token;
			return base64
		},
		}
	}
</script>

<style lang='less'>
	@import './my.less';
</style>
