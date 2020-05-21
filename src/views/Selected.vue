<template>
  <div class="selected">
    <Nav :title="title" />
    <!-- <van-tree-select height="191vw" :items="items" :main-active-index.sync="active">
      <template #content>
        <van-image v-if="active === 0" src="https://img.yzcdn.cn/vant/apple-1.jpg" />
        <van-image v-if="active === 1" src="https://img.yzcdn.cn/vant/apple-2.jpg" />
      </template>
    </van-tree-select>-->
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
  </div>
</template>

<script>
import Nav from "../components/Nav";
export default {
  created() {
    // this.$iHttp.get('/api/ranking/gender').then(res=>{
    //     console.log(res)
    // })
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
      active: 0,
      items: [
        { text: "分组 1" },
        { text: "分组 2" },
        { text: "分组 2" },
        { text: "分组 2" }
      ],
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
    Nav
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