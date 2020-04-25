<template>
	<view>
		<view class="topBox">
			<view class="images">
				
			</view>
			<view class="name">
				冷冷的
			</view>
			<view class="introduce">
				我们不提供任何课程的观看及下载，只给您推荐正确的学习路线，如果您喜欢课程，请自己购买！
			</view>
		</view>
		
		<view class="content">
			<view class="contentTitle">
				精品课程
			</view>
			<view class="classBox">
				<view class="item" v-for="(item,index) in classList" :key="index">
					<view class="itemImg">
						<img :src="item.image" alt="">
					</view>
					<view class="itemTitle">
						{{item.title}}
					</view>
					<view class="item_introduce">
						{{item.content}}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curriculumName:'',
				classList:[]
			};
		},
		onShow(){
			this.init()
		},
		methods:{
			init(){
				uni.request({
					url: 'http://203.195.222.243/v1/curriculum/getList', //仅为示例，并非真实接口地址。
					method:'GET',
					header: {
						// 'Authorization': getBase64(uni.getStorageSync('token')) //自定义请求头信息
					},
					success: (res) => {
						if(res.data.code == 200){
							this.classList = res.data.data
						}
					}
				})
			},
			searchCurriculum(){
				console.log(this.curriculumName)
			}
		}
	}
</script>

<style lang="less" >
	@import './gostudy.less';
</style>

