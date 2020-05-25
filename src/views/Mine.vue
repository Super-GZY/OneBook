<template>
  <div class="mine">
    <Nav :title="title" :isSimple="true" :isMine="true" />
    <div class="account">
      <van-image
        width="70"
        height="70"
        lazy-load
        round
        src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2475846514,4080595965&fm=26&gp=0.jpg"
      />
      <!-- <div class="avatar">
        <span>{{username.slice(0,1)}}</span>
      </div> -->
      <div class="brief">
        <span class="name">{{username}}</span>
        <!-- <span class="name">Morty</span> -->
      </div>
    </div>
    <van-cell-group>
      <van-cell icon="user-circle-o" title="我的账户" title-style="color:grey" is-link />
      <van-cell icon="browsing-history-o" title="阅读历史" title-style="color:grey" is-link @click="$router.push('/history')"/>
      <van-cell icon="smile-o" title="OneBook" title-style="color:grey" is-link />
      <!-- <van-cell icon="setting-o" title="设置" title-style="color:grey" is-link /> -->
      <van-cell icon="info-o" title="版本" value="V 1.0.0" title-style="color:grey" />
    </van-cell-group>
    <div class="logOut">
      <van-cell clickable>
        <div class="btn" @click="logOut">
          <span>退出登录</span>
        </div>
      </van-cell>
    </div>
    <Footer v-if="!$store.state.isRead" />
  </div>
</template>

<script>
import Footer from "../components/Footer";
import Nav from "../components/Nav";
export default {
  created() {
    this.$store.commit("changeRead", false);
    this.username = localStorage.getItem("OneBook_Usr");
  },
  data() {
    return {
      title: "个人中心",
      username: ""
    };
  },
  methods: {
    logOut() {
      this.$dialog
        .confirm({
          message: "确定退出？",
          closeOnPopstate: true
        })
        .then(res => {
          localStorage.setItem("OneBook_Login", false);
          localStorage.removeItem('OneBook_Usr')
          this.$router.push("/login");
        })
        .catch(err => {
          console.log("fail");
        });
    }
  },
  components: {
    Nav,
    Footer
  }
};
</script>

<style lang="scss" >
.mine {
  .account {
    height: 1.3rem;
    background-color: #f26552;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color: #f5f5f5;
    border-bottom: 7px solid #f6f7f9;
    .avatar{
      width: 0.6rem;
      height: 0.6rem;
      border: 2px solid orange;
      border-radius: 50%;
      text-align: center;
      line-height: 0.6rem;
      font-size: 22px
    }
    .brief {
      .name {
        font-size: 18px;
        font-weight: 300;
      }
      .email {
        font-size: 17px;
        font-weight: 300;
      }
    }
  }
  .logOut {
    //   margin-top: 1rem;
    border-top: 15px solid #f6f7f9;
    border-bottom: 15px solid #f6f7f9;
    .btn {
      display: flex;
      justify-content: center;
      justify-content: center;
      color: #f06269;
    }
  }
}
</style>