<template>
  <div class="nav">
    <van-nav-bar
      :title="title"
      fixed
      placeholder
      z-index="2"
      @click-left="isBack?back():''"
      @click-right="!isBack?isMine?'':isChange?$router.push('/share'):$router.push('/search'):''"
      :border='false'
    >
        <template #left v-if="isBack">
          <van-icon name="arrow-left" size="22" color="#fff" />
        </template>
        <template #right v-if='!isBack && !isSimple'>
          <van-icon name="search" size="22" color="#fff" />
        </template>
        <template #right v-if='!isSimple' >
          <van-icon :name="!isChange?'search':'plus'" size="22" color="#fff" />
        </template>
         <!-- <template #right v-if='isMine' >
          <van-icon name="envelop-o" size="22" color="#fff" />
        </template> -->
        <solt/>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "OneBook",
      type: String
    },
    isBack: {
      default: false,
      type: Boolean
    },
    isSimple: {
      default: false,
      type: Boolean
    },
    isChange: {
      default: false,
      type: Boolean
    },
    isMine: {
      default: false,
      type: Boolean
    },
    path: {
      default: "/",
      type: String
    },
    isBlank: {
      default: false
    },
    up_id: {
      default: "",
      type: String
    }
  },
  methods: {
    back() {
      if (this.isBlank) {
        this.$router.push({
          path: this.up_id == "" ? this.path : "/blank",
          query: { id: this.up_id }
        });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang='scss'>
.nav {
  .van-nav-bar {
    // background-color: #ed414a;
    // background-color: #4fc08d;
    background-color: #f26552;
    // background: url('http://img3.imgtn.bdimg.com/it/u=196544027,499629478&fm=26&gp=0.jpg') no-repeat;
    // background-size: cover;
    // backdrop-filter: blur(10px);
    .van-nav-bar__title {
      color: #fff;
      letter-spacing: 0.02rem;
      font-weight: 500;
    }
  }
}
</style>