<template>
  <div class="list">
    <Nav :title="$route.query.major" :isBack='true'/>
    <van-sticky offset-top="46">
      <van-dropdown-menu active-color="#4fc08d">
        <van-dropdown-item v-model="type" :options="typeOption" @change="selected($event,'type')" />
        <van-dropdown-item
          v-model="minor"
          :options="minorOption"
          @change="selected($event,'minor')"
        />
      </van-dropdown-menu>
    </van-sticky>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="isFind">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="到底啦"
        @load="onLoad"
        :immediate-check="false"
      >
        <van-cell-group >
          <van-cell v-for="item in booksList.content" :key="item._id" clickable center :to="{path:'/detail',query:{id:item._id}}" >
            <div class="bookList">
              <img :src="$store.state.imgPrefix+item.cover" alt style="width:25%;height:1.2rem" />
              <div class="info">
                <span class="title">{{item.title}}</span>
                <p class="brief">{{item.shortIntro}}</p>
                <div class="author">
                  <div class="name">
                    <van-icon name="contact" size="18" color="gray" />
                    <span>{{item.author}}</span>
                  </div>
                  <div class="tag">
                    <van-tag type="warning">{{item.retentionRatio+'%'}}留存</van-tag>
                    <van-tag type="danger">{{item.latelyFollower}}人气</van-tag>
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
    <van-empty
      v-else
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="没有书啦"
    />
  </div>
</template>

<script>
import Nav from '../../components/Nav'
export default {
  created() {
    this.$store.commit("changeRead", true);

    this.requestItem.major = this.$route.query.major;
    this.isFind = true;
    switch (this.$route.query.gender) {
      case "男生": {
        this.requestItem.gender = "male";
        break;
      }
      case "女生": {
        this.requestItem.gender = "female";
        break;
      }
      case "漫画": {
        this.requestItem.gender = "picture";
        break;
      }
      case "出版": {
        this.requestItem.gender = "press";
        break;
      }
      default:
        break;
    }
    this.$iHttp.get("/api/cats/lv2").then(res => {
      let mins = res.data[this.requestItem.gender].filter(
        item => item.major == this.requestItem.major
      )[0].mins;
      mins.map(item => {
        let minsObj = {
          text: item,
          value: item
        };
        this.minorOption.push(minsObj);
      });
    });
    this.$iHttp.get("/api/book/by-categories", this.requestItem).then(res => {
      res.data.books.map(item => {
        if (item.latelyFollower >= 10000) {
          item.latelyFollower = (item.latelyFollower / 10000).toFixed(1) + "万";
        }
      });
      this.booksList.content = res.data.books;
      this.booksList.total = res.data.total;
      if (this.booksList.content.length == 0) {
        this.isFind = false;
      }
    });
  },
  data() {
    return {
      requestItem: {
        gender: "",
        type: "hot",
        major: "",
        minor: "",
        start: 0,
        limit: 20
      },
      type: "hot",
      minor: "",
      typeOption: [
        { text: "热门", value: "hot" },
        { text: "新书", value: "new" },
        { text: "好评", value: "reputation" },
        { text: "完结", value: "over" },
        { text: "包月", value: "monthly" }
      ],
      minorOption: [{ text: "全部", value: "" }],
      booksList: {
        total: 0,
        content: []
      },
      loading: false,
      finished: false,
      refreshing: false,
      isFind: true
    };
  },
  methods: {
    selected(value, type) {
        window.scrollTo(0, 0);
      this.isFind = true;
      if (type == "type") {
        this.requestItem.type = value;
      } else if (type == "minor") {
        this.requestItem.minor = value;
      }
      this.requestItem.start = 0;
      this.$iHttp.get("/api/book/by-categories", this.requestItem).then(res => {
        res.data.books.map(item => {
          if (item.latelyFollower >= 10000) {
            item.latelyFollower =
              (item.latelyFollower / 10000).toFixed(1) + "万";
          }
        });
        this.booksList.content = res.data.books;
        this.booksList.total = res.data.total;
        if (this.booksList.content.length == 0) {
          this.isFind = false;
        }
      });
    },
    onLoad() {
      if (this.refreshing) {
        //下拉刷新
        this.booksList.content = [];
        this.refreshing = false;
        this.requestItem.start = 0;
        this.isFind = true;
        this.$iHttp
          .get("/api/book/by-categories", this.requestItem)
          .then(res => {
            res.data.books.map(item => {
              if (item.latelyFollower >= 10000) {
                item.latelyFollower =
                  (item.latelyFollower / 10000).toFixed(1) + "万";
              }
              this.booksList.content.push(item);
            });
            this.booksList.total = res.data.total;
            if (this.booksList.content.length == 0) {
              this.isFind = false;
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.booksList.content.length >= this.booksList.total) {
              this.finished = true;
            }
          });
      } else {
        //上拉加载
        // 异步更新数据
        this.requestItem.start = this.requestItem.start + 20;
        this.$iHttp
          .get("/api/book/by-categories", this.requestItem)
          .then(res => {
            res.data.books.map(item => {
              if (item.latelyFollower >= 10000) {
                item.latelyFollower =
                  (item.latelyFollower / 10000).toFixed(1) + "万";
              }
              this.booksList.content.push(item);
            });
            this.booksList.total = res.data.total;
            if (this.booksList.content.length == 0) {
              this.isFind = false;
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成

            if (this.booksList.content.length >= this.booksList.total) {
              this.finished = true;
            }
          });
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  },
  components: {
    Nav
  }
};
</script>


<style lang='scss'>
.list {
  .custom-image .van-empty__image {
    width: 40%;
    height: 30%;
  }
  .bookList {
    display: flex;
    justify-content: space-between;
    .info {
      width: 73%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
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
        margin-left: 0.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          display: flex;
          align-items: center;
          span {
            font-size: 12px;
            margin-left: 0.01rem;
          }
        }
        .van-tag {
          margin-left: 0.05rem;
        }
      }
    }
  }
}
</style>