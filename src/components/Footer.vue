<template>
  <div class="footer">
    <van-tabbar v-model="active" route placeholder active-color='#f26552'>
      <van-tabbar-item icon="wap-home-o" to="/">书城</van-tabbar-item>
      <van-tabbar-item icon="gem-o" to="/selected">精选</van-tabbar-item>
      <van-tabbar-item icon="bar-chart-o" to="/rank">排行</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/bookshelf">书架</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data(){
    return{
      active:''
    }
  }
}
</script>