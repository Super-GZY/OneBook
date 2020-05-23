<template>
  <div class="register" :style="{height:screenHeight+'px'}">
    <div class="content">
      <!-- <h1>OneBook</h1> -->
      <img src="../../assets/logo.png" style="width:2rem" alt />
      <!-- <h2>登录</h2> -->
      <div class="ipt">
        <van-form @submit="onSubmit">
          <van-cell-group>
            <van-field
              v-model="username"
              required
              :rules="[{ required: true, message: '请填写用户名' }]"
              label="用户名"
              clearable
              placeholder="请输入用户名"
            />
            <van-field
              v-model="password"
              type="password"
              label="密码"
              placeholder="密码"
              required
              clearable
              :rules="[{ required: true, message: '请填写密码'}]"
            />
            <!-- <van-field
              v-model="email"
              label="邮箱"
              placeholder="邮箱"
              required
              clearable
              :rules="[{ required: true, message: '请正确填写邮箱',pattern:/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/}]"
            /> -->
            <!-- <van-field
              v-model="code"
              center
              clearable
              label="邮箱验证码"
              placeholder="请输入邮箱验证码"
              required
              :rules="[{ required: true, message: '请正确填写邮箱' }]"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  :disabled="isAuth"
                  @click="veryfied"
                >{{isAuth?auth_time:'发送验证码'}}</van-button>
              </template>
            </van-field> -->
          </van-cell-group>
          <div class="btnGroup">
            <van-button class="btn" type="warning" @click="register">注册</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  created() {
    this.screenHeight = window.screen.height * 0.81;
    this.$store.commit("changeRead", true);
  },
  data() {
    return {
      screenHeight: 0,
      password: "",
      username: "",
      email: "",
      code: "",
      auth_time: 0,
      isAuth: false
    };
  },
  methods: {
    register() {
      // if (this.username == "Morty" && this.password == 123) {
      //   localStorage.setItem("OneBook_Login", true);
      //   this.$router.push("/");
      //   this.$store.commit("changeRead", false);
      // } else {
      //   this.$dialog.alert({
      //     message: "登录信息有误"
      //   });
      // }
      if (this.username == "" && this.password == "") {
        this.$dialog.alert({
          message: "用户名或密码不为空"
        });
      } else {
        this.$iHttp
          .post("/log/reguser", {
            resusername: this.username,
            rpassword: this.password
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$dialog.alert({
                message: res.data.message
              }).then(res=>{
              this.$router.push("/login");
              });
            } else {
              this.$dialog.alert({
                message: res.data.message
              });
            }
          });
      }
    },
    veryfied() {
      this.verifiedTimer();
    },
    onSubmit(values) {
    },
    verifiedTimer() {
      this.isAuth = true;
      this.auth_time = 60;
      let auth_time_timer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.isAuth = false;
          clearInterval(auth_time_timer);
        }
      }, 1000);
    }
  },
  components: {}
};
</script>

<style lang="scss" >
.register {
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


