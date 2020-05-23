<template>
  <div class="search">
    <van-sticky>
      <form action="/">
        <van-search
          v-model="value"
          placeholder="搜索您喜欢的书籍"
          shape="round"
          show-action
          @search="search"
        >
          <!-- <template #label>
            <span style="color:grey">书名</span>
          </template>-->
          <template #action>
            <span
              @click="isSearch?back():$router.go(-1)"
            >{{isSearch?'返回':'取消'}}</span>
          </template>
        </van-search>
      </form>
    </van-sticky>
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
      <template v-if="!isSearch">
        <van-divider content-position="left">
          <span style="color:#000;font-weight:400">热门搜索</span>
        </van-divider>

        <div class="hotword">
          <van-tag
            @click="search"
            plain
            round
            type="warning"
            size="large"
            v-for="item in hotWords"
            :key="item.times"
          >{{item.word}}</van-tag>
        </div>

        <van-divider content-position="left">
          <span style="color:#000;font-weight:400">历史记录</span>
        </van-divider>

        <div class="history">
          <van-tag
            type="success"
            size="large"
            v-for="(item,index) in history"
            :key="index"
            closeable
            @close="close(index)"
            @click="search"
          >{{item}}</van-tag>
        </div>
        <van-empty v-if="history.length == 0 ?true:false" image="search" />
      </template>

      <!-- 搜索结果列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-else>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="到底啦"
          @load="onLoad"
          :immediate-check="false"
        >
          <van-cell-group>
            <van-cell v-for="item in booksList.content" :key="item.id" clickable center :to="{path:'/detail',query:{id:item._id}}">
              <div class="bookList">
                <img :src="$store.state.imgPrefix+item.cover" alt style="width:25%;height:1.2rem" />
                <div class="info">
                  <span class="title">{{item.title}}</span>
                  <p class="brief">{{item.shortIntro}}</p>
                  <div class="author">
                    <div class="name">
                      <van-icon name="contact" size="18" color="gray" />
                      <span class="van-ellipsis">{{item.author}}</span>
                    </div>
                    <div class="tag">
                      <van-tag type="warning" >{{item.retentionRatio+'%'}}留存</van-tag>
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
        v-if="isSearch && !isFind"
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="没有找到"
      />
    </template>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("changeRead", true);

    this.history = localStorage.getItem("HistoryWords")
      ? JSON.parse(localStorage.getItem("HistoryWords")).splice(0, 9)
      : [];
    this.$iHttp.get("/api/book/search-hotwords").then(res => {
      this.hotWords = res.data.searchHotWords.splice(0, 15);
    });
  },
  data() {
    return {
      value: "",
      hotWords: [],
      history: [],
      booksList: {
        total: 0,
        content: []
      },
      loading: false,
      finished: false,
      refreshing: false,
      isSearch: false,
      isFind: true
    };
  },
  methods: {
    search(val) {
      //置顶
      if (val.isTrusted) {
        val = val.target.textContent;
        this.value = val;
      }
      window.scrollTo(0, 0);
      this.isSearch = true;
      this.isFind = true;
      //向localStorge存储历史记录
      let newArr = localStorage.getItem("HistoryWords")
        ? JSON.parse(localStorage.getItem("HistoryWords"))
        : [];
      let index = newArr.indexOf(val);
      if (index != -1) {
        newArr.splice(index, 1);
      }
      newArr.unshift(val);
      localStorage.setItem("HistoryWords", JSON.stringify(newArr));
      this.history = JSON.parse(localStorage.getItem("HistoryWords"));
      //获取搜索结果
      this.$iHttp
        .get("/api/book/fuzzy-search", {
          query: val
        })
        .then(res => {
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
    close(idx) {
      let oldHistory = JSON.parse(localStorage.getItem("HistoryWords"));
      oldHistory.splice(idx, 1);
      let newHistory = oldHistory;
      localStorage.setItem("HistoryWords", JSON.stringify(newHistory));
      this.history = JSON.parse(localStorage.getItem("HistoryWords")).splice(
        0,
        9
      );
    },
    onLoad() {
      if (this.refreshing) {
        //下拉刷新
        // this.booksList.content = [];
        this.refreshing = false;
        this.$iHttp
          .get("/api/book/fuzzy-search", {
            query: this.value
          })
          .then(res => {
            res.data.books.map(item => {
              if (item.latelyFollower >= 10000) {
                item.latelyFollower =
                  (item.latelyFollower / 10000).toFixed(1) + "万";
              }
            });
            this.booksList.content = res.data.books;
            this.booksList.total = res.data.total;
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
        // this.limit = this.limit + 20;
        // this.$iHttp
        //   .get("/api/book/fuzzy-search", {
        //     query: this.value
        //   })
        //   .then(res => {
        //     console.log("onload");
        //     res.data.books.splice(this.limit - 20, this.limit).map(item => {
        //       this.booksList.content.push(item);
        //     });
        //     this.booksList.total = res.data.total;
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.booksList.content.length >= this.booksList.total) {
          this.finished = true;
        }
        //   });
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    back() {
      this.isSearch = false;
      this.booksList.content = [];
      this.booksList.total = 0;
      this.isFind = true;
      this.value = "";
      this.history = JSON.parse(localStorage.getItem("HistoryWords")).splice(
        0,
        9
      );
    }
  }
};
</script>

<style lang='scss'>
.search {
  .hotword {
    width: 90%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-left: 0.1rem;
    .van-tag {
      margin-left: 0.05rem;
      margin-top: 0.1rem;
    }
  }
  .history {
    width: 90%;
    display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;
    margin-left: 0.1rem;
    .van-tag {
      margin-left: 0.05rem;
      margin-top: 0.1rem;
    }
  }
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