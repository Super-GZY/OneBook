<template>
  <div class="rank">
    <Nav :title="title" />
    <van-tabs
      v-model="tabsActive"
      type="line"
      swipeable
      animated
      sticky
      offset-top="46"
      @change="changwRank"
    >
      <van-tab v-for="(item,index) in titleList" :key="index" :title="item">
        <van-tree-select
          height="180vw"
          :items="items"
          :main-active-index.sync="active"
          @click-nav="changeContent"
        >
          <template #content>
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
            <template v-else>
              <van-cell-group v-if="booksList.length !=0">
                <van-cell
                  v-for="(val,index) in booksList"
                  :key="index"
                  clickable
                  center
                  :to="{path:'/detail',query:{id:val._id}}"
                >
                  <div class="bookList">
                    <img
                      :src="$store.state.imgPrefix+val.cover"
                      alt
                      style="width:35%;height:1.2rem"
                    />
                    <div class="info">
                      <span class="title">{{val.title}}</span>

                      <div class="author">
                        <div class="name">
                          <van-icon name="contact" size="18" color="gray" />
                          <span>{{val.author}}</span>
                        </div>
                        <div class="tag"></div>
                      </div>
                      <p class="brief">{{val.shortIntro}}</p>
                    </div>
                  </div>
                </van-cell>
              </van-cell-group>
              <van-empty
                v-else
                class="custom-image"
                description="排行数据不足"
              />
            </template>
          </template>
        </van-tree-select>
      </van-tab>
    </van-tabs>
     <Footer v-if='!$store.state.isRead'/>

  </div>
</template>

<script>
import Footer from "../components/Footer";
import Nav from "../components/Nav";
export default {
  created() {
    this.$store.commit("changeRead", false);

    this.$iHttp.get("/api/ranking/gender").then(res => {
      res.data.male.map(val => {
        let itemObj = {};
        let idx = val.title.indexOf("Top100");
        if (idx != -1) {
          val.title = val.title.substring(0, idx);
        }
        itemObj.text = val.title;
        this.items.push(itemObj);
      });
      this.rankItems = res.data.male;
      this.$iHttp.get("/api/ranking/" + this.rankItems[0]._id).then(res => {
        this.booksList = res.data.ranking.books.splice(0, 20);
      });
    });
  },
  data() {
    return {
      title: "排行",
      tabsActive: 0,
      active: 0,
      rankItems: {},
      items: [],
      booksList: [],
      titleList: ["周榜", "月榜", "总榜"]
    };
  },
  methods: {
    changeUnit(val) {
      if (val >= 10000) {
        val = (val / 10000).toFixed(1) + "万";
      }
      return val;
    },
    changeContent(idx) {
      this.$iHttp.get("/api/ranking/" + this.rankItems[idx]._id).then(res => {
        this.booksList = res.data.ranking.books.splice(0, 20);
      });
    },
    changwRank(idx) {
      this.active = 0;
      let item;
      if (idx == 0) {
        item = this.rankItems[0]._id;
      } else if (idx == 1) {
        item = this.rankItems[0].monthRank;
      } else {
        item = this.rankItems[0].totalRank;
      }
      this.$iHttp.get("/api/ranking/" + item).then(res => {
        this.booksList = res.data.ranking.books.splice(0, 20);
      });
    }
  },
  components: {
    Nav,
    Footer
  }
};
</script>


<style lang="scss" scoped>
.rank {
  .bookList {
    display: flex;
    justify-content: space-between;
    .info {
      width: 63%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      .title {
        font-size: 14px;
        font-weight: 500;
      }
      .brief {
        font-size: 12px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: gray;
        margin-left: 0.05rem;
      }
      .author {
        margin-top: 0.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          display: flex;
          align-items: center;
          span {
            font-size: 12px;
            margin-left: 0.01rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
        
      }
    }
  }
}
</style>