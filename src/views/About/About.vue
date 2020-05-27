<template>
  <div class="about">
    <Nav :title="title" :isSimple="true" :isMine="true" :isBack="true" />
    <div class="content">
      <img src="../../assets/logo.png" style="width:1.2rem"/>
      <p>
        首先，OneBook书城这一想法起源于我大二时开的一门专业课——《网页设计》，由于当时课程设计的需要，我们被分到了不同的小组，要求作出一个不限类型的功能网站出来，而我这一组同意了我做书城的想法，因为当时的“技术人员“也就一两个😂。但由于当时技术的局限性，做出来的网站只是一些静态的页面并且风格是仿照的网易云阅读，用的编辑器也还是远古的DW。可我们的功能也还是很全面的，绘制了网站早期Logo，也申请了微信公众号，但由于“学业”繁忙，后期的也就没在更新了,公众号我会放在会面。
      </p>
      <p>然后，这次也算是重拾旧忆吧，对于OneBook我也给他重新定义了一下方向，主体就是云阅读功能，遇到了很多问题，也都成功解决，算是一个自我成长的过程吧。</p>
      <p>最后，本项目里的技术栈中前端选择使用了Vue.js框架，UI框架选择了Vant，后端选择了Node.js中的Koa框架，数据库使用的是MongoDB，搭建的服务器与域名选择了阿里云，服务器是Ubuntu x64位系统，网站使用的是Nginx服务代理。</p>
      <p>附上早期logo与微信公众号: zhuoyanyibenshu。</p>
      <img src="../../assets/early_logo.jpeg" style="width:1.2rem">
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";

export default {
  created() {},
  data() {
    return {
      title: "关于Onebook"
    };
  },
  methods: {},
  components: {
    Nav
  }
};
</script>

<style lang="scss" >
.about {
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #5f5f5f;
    p {
      width: 90%;
      font-size: 14px;
      text-indent: 2em;
      line-height: 20px
    }
    span{
        font-size: 10px
    }
  }
}
</style>