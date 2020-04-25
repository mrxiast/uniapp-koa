<template>
  <view>
    123
    <button @click="getBook">获取</button>
  </view>
</template>

<script>
import getToken from '../../utils/utils'
export default {
  data() {
    return {}
  },
  methods: {
    getBook() {
      uni.request({
        url: 'http://203.195.222.243/v1/classic',
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json',
          Authorization: getToken(uni.getStorageSync('token'))
        },
        success: res => {
          console.log(res, 'ressssss')
          if (res.statusCode === 200) {
          } else {
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
