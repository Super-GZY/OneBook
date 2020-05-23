<template>
  <div class="login" :style="{height:screenHeight+'px'}">
    <div class="content">
      <!-- <h1>OneBook</h1> -->
      <img src="../../assets/logo.png" style='width:2rem' alt="">
      <!-- <h2>登录</h2> -->
      <div class="ipt">
        <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            placeholder="用户名"
            left-icon="user-o"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            placeholder="密码"
            left-icon="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1226665473,3403803806&fm=26&gp=0.jpg"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-form>
        <div class="btnGroup">
          <van-button class="btn" type="primary" @click="login">登录</van-button>
          <van-button class="btn" type="warning" @click="$router.push('register')">注册</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  created() {
    this.screenHeight = window.screen.height*0.81;
    this.$store.commit("changeRead", true);
  },
  data() {
    return {
      screenHeight: 0,
      password: "",
      username: ""
    };
  },
  methods: {
    login() {
      if (this.username == "Morty" && this.password == 123) {
        localStorage.setItem("OneBook_Login", true);
        this.$router.push("/");
        this.$store.commit("changeRead", false);
      } else {
        this.$dialog.alert({
          message: "登录信息有误"
        });
      }
    },
    onSubmit(values) {}
  },
  components: {}
};
</script>

<style lang="scss" >
.login {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  //   align-items: center;
  .content {
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-weight: 300;
    }
    h2 {
      font-weight: normal;
    }
    .ipt {
      width: 90%;
      height: 1.8rem;
      .van-field {
        height: 0.6rem;
      }
      .btnGroup {
        display: flex;
        justify-content: space-around;
        margin-top: 0.3rem;
        .btn {
          width: 30%;
          height: 0.4rem;
        }
      }
    }
  }
}
</style>


