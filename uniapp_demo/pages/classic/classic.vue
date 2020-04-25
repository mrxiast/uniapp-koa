<template>
	<view class="box">
		<view class="pageTop">
			<view class="topLeft">
				<view class="topLeftLeft">
					<span style="font-size:30rpx;">No.</span>
					<span style="font-size:50rpx;">{{nowStage.index}}</span>
				</view>
				<view class="topLeftRight">
					<view>四月</view>
					<view>2020</view>
				</view>
				
			</view>
			<view class="topRight">
				<view class="share">
					
					<button open-type="share" class="shareBtn">
						<img src="../../static/imgs/share.png" alt="" @click="sharePath">
					</button>
				</view>
				<view class="zan" @click="clickLight"> 
					<img :src="isLike ? '../../static/imgs/zan1.png':'../../static/imgs/zan.png'" alt="" >
					<span>{{isCanUse === 1 ? nowStage.fav_nums : likeCount}}</span>
				</view>
			</view>
		</view>
		<view class="content" v-if="nowStage.type === 100">
			<view class="bigPic">
				<img :src="nowStage.image" alt="">
				<view class="mediaType">电影</view>
			</view>
			<view class="con_content">
				影评：{{nowStage.content}}。
			</view>
		</view>
		<view class="content"  v-if="nowStage.type === 200">
			<view class="bigPic">
				<img :id="isPlay ? 'xuanzhun' : ''" class="musicPic" :src="nowStage.image" alt="">
				<view class="playBox">
					<img  class="playBtn" :src='!isPlay ? "../../static/imgs/play.png" : "../../static/imgs/pause.png"' alt="" @click="audioPlay" />
				</view>
				<view class="mediaType">音乐</view>
			</view>
			<view class="con_content">
				乐评：{{nowStage.content}}
			</view>
		</view>
		<view class="content"  v-if="nowStage.type === 300">
			<view class="bookPic">
				<img :src="nowStage.image" alt="">
				<view class="mediaType">书籍</view>
			</view>
			<view class="con_content">
				书评：{{nowStage.content}}
			</view>
		</view>
		<view class="selectNext">
				<img :src="nowStage.index < allCount ? '../../static/imgs/left1.png' : '../../static/imgs/left.png'" alt="" @click="nextStage">
			<view>{{nowStage.title}}</view>
				<img :src="nowStage.index > 1 ? '../../static/imgs/right1.png' : '../../static/imgs/right.png'" alt="" @click="preStage" >
			
		</view>
	</view>
</template>

<script>
	import {getBase64,get} from '../../utils/utils.js'
	export default {
		data() {
			return {
				nowMonth:'',
				nowYear:'',
				innerAudioContext:null,
				isPlay:false,
				allCount:0,
				type:0,
				nowStage:{},
				likeCount:null,
				isLike:null,
				isCanUse: uni.getStorageSync('isCanUse')||1//默认为true
			}
		},
		onShow(){
			console.log('001')
			this.init()
		},
		methods: {
			init(){
				this.nowYear = new Date().getFullYear()
				let month = new Date().getMonth()+1
				switch (month){
					case 1:
						this.nowMonth = "一月"
					break;
					case 2:
						this.nowMonth = "二月"
					break;
					case 3:
						this.nowMonth = "三月"
					break;
					case 4:
						this.nowMonth = "四月"
					break;
					case 5:
						this.nowMonth = "五月"
					break;
					case 6:
						this.nowMonth = "六月"
					break;
					case 7:
						this.nowMonth = "七月"
					break;
					case 8:
						this.nowMonth = "八月"
					break;
					case 9:
						this.nowMonth = "九月"
					break;
					case 10:
						this.nowMonth = "十月"
					break;
					case 11:
						this.nowMonth = "十一月"
					break;
					case 12:
						this.nowMonth = "十二月"
					break;
					default:
					break;
				}
				this.getLast()//获取最新一期的期刊
				this.createAudio()//创建audio对象
			},
			getLast(){
				let that = this
				get('http://203.195.222.243/v1/classic/last').then(res=>{
						this.nowStage = res.data.data
						this.allCount = JSON.parse(JSON.stringify(res.data.data)).allCount
						this.nowIndex = JSON.parse(JSON.stringify(res.data.data)).index
						this.getZanCount(this.nowStage.type,this.nowStage.id)
				})
				// uni.request({
				//     url: 'http://127.0.0.1:3000/v1/classic/last', //仅为示例，并非真实接口地址。
				// 	method:'GET',
				//     header: {
				//         // 'Authorization': that._encode() //自定义请求头信息
				//     },
				//     success: (res) => {
				//         console.log(res.data.data);
				// 		this.nowStage = res.data.data
				// 		this.allCount = JSON.parse(JSON.stringify(res.data.data)).allCount
				// 		this.nowIndex = JSON.parse(JSON.stringify(res.data.data)).index
				// 		this.getZanCount(this.nowStage.type,this.nowStage.id)
				//     }
				// });
			},
			sharePath(){
				wx.onShareAppMessage()
			},
			clickLight(){
				let that = this
				if(this.isLike){
					uni.request({
					    url: 'http://203.195.222.243/v1/like/disLike', //仅为示例，并非真实接口地址。
						method:'POST',
						data:{
							art_id:this.nowStage.id,
							type:this.nowStage.type
						},
					    header: {
					        'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
					    },
					    success: (res) => {
							that.getZanCount(that.nowStage.type,that.nowStage.id)
					        console.log(res);
					    }
					});
				}else{
					uni.request({
					    url: 'http://203.195.222.243/v1/like', //仅为示例，并非真实接口地址。
						method:'POST',
						data:{
							art_id:this.nowStage.id,
							type:this.nowStage.type
						},
					    header: {
					        'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
					    },
					    success: (res) => {
							that.getZanCount(that.nowStage.type,that.nowStage.id)
					    }
					});
				}
				
				
				
			},
			createAudio(){
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
			},
			audioPlay(){
				this.innerAudioContext.src = this.nowStage.url
				this.isPlay = !this.isPlay
				if(this.isPlay){
					this.innerAudioContext.play()
				}else{
					this.innerAudioContext.pause()
				}
				this.innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
				this.innerAudioContext.onPause(() => {
				  console.log('暂停播放');
				});
				this.innerAudioContext.onStop(()=>{
					this.isPlay = false
				})
				this.innerAudioContext.onEnded(()=>{
					this.isPlay = false
				})
			},
			preStage(){
				this.innerAudioContext.stop()
				this.isPlay = false
				if(this.nowStage.index > 1){
					this.nowStage.index--
					this.clickQuery()
				}else{
					return
				}
			},
			nextStage(){
				this.innerAudioContext.stop()
				this.isPlay = false
				if(this.nowStage.index < this.allCount){
					this.nowStage.index++
					this.clickQuery()
				}else{
					return
				}
			},
			clickQuery(){
				uni.request({
					url: 'http://203.195.222.243/v1/classic/query', //仅为示例，并非真实接口地址。
					method:'GET',
					data:{
						index:this.nowStage.index
					},
					header: {
						// 'Authorization': that._encode() //自定义请求头信息
					},
					success: (res) => {
						this.nowStage = res.data.data
						this.getZanCount(this.nowStage.type*1,this.nowStage.id)
						console.log(res.data.data);
						this.getZanCount(this.nowStage.type,this.nowStage.id)
					}
				})
			} ,
			getZanCount(type,art_id){
				let params = {
					type,
					art_id
				}
				get('http://203.195.222.243/v1/classic/zanAllCount',params).then(res=>{
					if(res.data.code == 200){
						console.log(res,'resresres')
						this.likeCount = res.data.data.fav_nums
						this.isLike = res.data.data.isLike
					}
				})
				// uni.request({
				// 	url: 'http://127.0.0.1:3000/v1/classic/zanAllCount', //仅为示例，并非真实接口地址。
				// 	method:'GET',
				// 	data:{
				// 		type:type,
				// 		art_id:art_id
				// 	},
				// 	header: {
				// 		'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
				// 	},
				// 	success: (res) => {
				// 		console.log(res,'resresres')
				// 		this.likeCount = res.data.data.fav_nums
				// 		this.isLike = res.data.data.isLike
				// 	}
				// })
			}
				
			}
	}
</script>

<style lang="less">
	@import './classic.less';
</style>
