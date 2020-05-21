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
      <div class="brief">
        <span class="name">Morty</span>
        <!-- <span class="name">Morty</span> -->
      </div>
    </div>
    <van-cell-group>
      <van-cell icon="user-circle-o" title="我的账户" title-style="color:grey" is-link />
      <van-cell icon="browsing-history-o" title="阅读历史" title-style="color:grey" is-link />
      <van-cell icon="setting-o" title="设置" title-style="color:grey" is-link />
      <van-cell icon="smile-o" title="作者信息" title-style="color:grey" is-link />
      <van-cell icon="info-o" title="版本" value="V 1.0.0" title-style="color:grey" />
    </van-cell-group>
    <div class="logOut">
      <van-cell clickable>
        <div class="btn" @click="logOut">
          <span>退出登录</span>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
export default {
  data() {
    return {
      title: "个人中心"
    };
  },
  methods: {
    logOut() {
      this.$dialog
        .confirm({
          message: "确定退出？",
          closeOnPopstate:true
        })
        .then(res => {
            localStorage.setItem("OneBook_Login",false)
          this.$router.push('/login')
        })
        .catch(err => {
          console.log("fail");
        });
    }
  },
  components: {
    Nav
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
    border-top: 10px solid #f6f7f9;
    border-bottom: 10px solid #f6f7f9;
    .btn {
      display: flex;
      justify-content: center;
      justify-content: center;
      color: #f06269;
    }
  }
}
</style>