<template>
  <div class="selected">
    <Nav :title="title" />
    
    <van-loading
      size="1px"
      type="none"
      vertical
      v-if="$store.state.loading"
      style="margin:50% 0 0 25%"
    >
      <img
        src="http://img.zcool.cn/community/0100dd5c246339a80121df90e0139f.gif"
        alt
        style="width:60%;height:60%"
      />
    </van-loading>
    <div class="cats" v-for="(item,index) in sortItems" :key="index" v-else>
      <h3>{{index}}</h3>
      <van-grid :column-num="3" clickable>
        <van-grid-item
          v-for="(value,idx) in sortItems[index]"
          :key="idx"
          @click="jump(index,value.name)"
        >
          <span class="name">{{value.name}}</span>
          <span class="count">{{value.bookCount}}本</span>
        </van-grid-item>
      </van-grid>
    </div>
     <Footer v-if='!$store.state.isRead'/>

  </div>
</template>

<script>
import Nav from "../components/Nav";
import Footer from "../components/Footer";
export default {
  created() {
    // this.$iHttp.get('/api/ranking/gender').then(res=>{
    //     console.log(res)
    // })
    this.$store.commit("changeRead", false);

    this.$iHttp.get("/api/cats/lv2/statistics").then(res => {
      delete res.data.ok;
      let keyMap = {
        male: "男生",
        female: "女生",
        picture: "漫画",
        press: "出版"
      };
      let newObj = Object.keys(res.data).reduce((newData, key) => {
        let newKey = keyMap[key] || key;
        newData[newKey] = res.data[key];
        return newData;
      }, {});
      this.sortItems = newObj;
    });
  },
  data() {
    return {
      sortItems: {},
      title: "精选"
    };
  },
  methods: {
    jump(index, name) {
      this.$router.push({
        name: "List",
        query: {
          gender: index,
          major: name
        }
      });
    }
  },
  components: {
    Nav,
    Footer
  }
};
</script>


<style lang='scss'>
.selected {
  //   .van-sidebar {
  //     flex: 0.6;
  //   }
  .cats {
    text-align: center;
    h3 {
      font-weight: 300;
      letter-spacing: 0.1rem;
    }
    .van-grid {
      .van-grid-item {
        .van-grid-item__text {
          font-size: 14px;
        }
        span {
          font-weight: 300;
        }
        .count {
          margin-top: 0.1rem;
          font-size: 14px;
          color: gray;
        }
      }
    }
  }
}
</style>