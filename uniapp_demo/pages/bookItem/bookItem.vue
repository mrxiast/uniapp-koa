<template>
	<view class="page">
		<view class="showPic">
			<view class="pic">
				<img :src="bookInfo.image" alt="">
			</view>
			<view class="bookTitle">
				{{bookInfo.title}}
			</view>
			<view class="bookAuthor">
				{{bookInfo.author}}
			</view>
		</view>
		
		<view class="short">
			<view class="shortTitle">
				<view class="title">经典短评</view>
			</view>
			<view class="shortCon">
				<view class="colorShort">可以的</view>
			</view>
		</view>
		
		<view class='bookCon'>
			<view class="bookCon_til">
				<span>内容简介</span>
			</view>
			<view class="bookCon_con">
				{{bookInfo.content}}
				</view>
		</view>
		
		<view class="commentBox">
			<view class="commentItem" v-for="(item,index) in bookComment" :key="index">
				<view class="avaUrl">
					<img :src="item.ava_url" alt="">
				</view>
				<view class="commentItem_con">
					<view class="commonName">
						<view class="nickName">{{item.nick_name}}</view>
						<view class="commentTime">2005-10-13 23:23:23</view>
					</view>
					<view class="commonCon">
						{{item.content}}
					</view>
				</view>
			</view>
			
			
		</view>
		
		<view class="bottom">
			<view class="inputBox">
				<input v-model="content" type="text" placeholder="请输入评论" confirm-type="send">
			</view>
			<view class="share">
				<button open-type="share" class="shareBtn">
					<img src="../../static/imgs/share.png" alt="" @click="sharePath">
				</button>
			</view>
			<view class="collection">
				<img :src="bookInfo.isLike ? '../../static/imgs/zan1.png' :'../../static/imgs/zan.png'" alt="" @click="addComment">
				<view class="count">{{bookInfo.fav_nums}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {Base64} from 'js-base64'
	export default {
		data() {
			return {
				id:'',
				bookInfo:{},
				content:'',
				bookComment:[]
			}
		},
		onLoad(options){
			this.id = options.id
			console.log(this.id,'id')
			this.getBookInfo()
			this.getComment()
		},
		methods: {
			getBookInfo(){
				uni.request({
					url: 'http://203.195.222.243/v1/book/getBookInfo', //仅为示例，并非真实接口地址。
					method:'GET',
					data:{
						id:this.id
					},
					header: {
						'Authorization': this._encode() //自定义请求头信息
					},
					success: (res) => {
						console.log(res)
						if(res.data.code == 200){
							this.bookInfo = res.data.data
						}
					}
				})
			},
			getComment(){
				uni.request({
					url: 'http://203.195.222.243/v1/comment/getComment', //仅为示例，并非真实接口地址。
					method:'GET',
					data:{
						id:this.id
					},
					header: {
						// 'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
					},
					success: (res) => {
						console.log(res.data.data)
						if(res.data.code == 200){
							this.bookComment = res.data.data
						}
					}
				})
			},
			addComment(){
				uni.request({
					url: 'http://203.195.222.243/v1/comment/addComment', //仅为示例，并非真实接口地址。
					method:'POST',
					data:{
						art_id:this.id,
						ava_url: uni.getStorageSync('avatarUrl'),
						nick_name: uni.getStorageSync('nickName'),
						type: 300,
						content:this.content
					},
					header: {
						'Authorization': this._encode() //自定义请求头信息
					},
					success: (res) => {
						if(res.data.errorCode === 0){
							this.getComment()
							uni.showToast({
								icon:'success',
							    title: '评论成功',
							    duration: 1000
							});
						}
					}
				})
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
	@import './bookItem.less';
</style>
