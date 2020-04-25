<template>
	<view>
		<view class="topBox">
			<view class="topSearch">
				<input type="text" class="inputClass" placeholder="请输入书籍名称" v-model="bookName"/>
				<view class="searchBtn" @click="searchBook">搜索</view>
			</view>
		</view>
		
		<view class="content">
			<view class="contentTitle">
				精选
			</view>
			<view class="con_item" v-if="bookList.length > 0">
				<view class="bookItem" v-for="(item,index) in bookList" :key="index" @click="bookInfo(item)">
					<view class="box_top">
						<img :src="item.image" alt="">
					</view>
					<view class="box_center">
						<view class="cen_title">{{item.title}}</view>
						<view class="cen_author">{{item.author}}</view>
					</view>
					<view class="box_bottom">
						{{item.fav_nums}} 喜欢
					</view>
				</view>
				
			</view>
			<view v-if="bookList.length === 0 && showNo" style="width:100%;padding:30rpx 0;text-align: center;">没有您要的搜索内容哦~~</view>
			
		</view>
		<view v-show="isLoading" style="text-align: center;width:100%;color:#ddd;font-size:25rpx;padding:10rpx 0;">{{isLoading && total===bookList.length ? '没有跟多内容了':'加载中...'}}</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookName:'',
				bookList:[],
				pageNum:1,
				pageSize:10,
				total:null,
				isLoading:null,
				showNo:false
			};
		},
		onLoad(){
			this.getBookList()
		},
		onReachBottom:function(){
			if(this.total === this.bookList.length) {
				this.isLoading = true
				return 
			}
			
			let _this = this
		  if(timer != null){
		   clearTimeout(timer);
		  }
		  let timer = setTimeout(function(){
				_this.pageNum++
				_this.getBookList()
		  }, 1000);
		 },
		 onPullDownRefresh() {
			 this.getBookList()
		 },
		methods:{
			searchBook(){
				let _this = this
				this.shwoNo = false
				this.isLoading = true
				uni.request({
					url: 'http://203.195.222.243/v1/book/searchBook', //仅为示例，并非真实接口地址。
					method:'GET',
					data:{
						name:this.bookName
					},
					header: {
						// 'Authorization': that._encode() //自定义请求头信息
					},
					success: (res) => {
						uni.stopPullDownRefresh();
						if(res.data.code == 200){
							setTimeout(function(){
								_this.isLoading = false
								_this.bookList = res.data.data
								if(res.data.data.length === 0){
									_this.showNo = true
								}else{
									_this.shwoNo = false
								}
							},500)
						}
					}
				})
				
			},
			bookInfo(e){
				uni.navigateTo({
				    url: '../bookItem/bookItem?id=' + e.id +'&type = 300'
				});
			},
			getBookList(){
				let _this = this
				this.isLoading = true
				uni.request({
					url: 'http://203.195.222.243/v1/book/getList', //仅为示例，并非真实接口地址。
					method:'GET',
					data:{
						pageSize:this.pageSize,
						pageNum:this.pageNum
					},
					header: {
						// 'Authorization': that._encode() //自定义请求头信息
					},
					success: (res) => {
						
						if(res.data.code == 200){
							setTimeout(function(){
								_this.isLoading = false
								_this.total = res.data.data.count
								_this.bookList.push(...res.data.data.rows)
							},500)
							
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" >
	@import './book.less';
</style>
