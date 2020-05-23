<template>
  <div class="activity">
    <Nav :title="title" :isSimple="true" :isMine="true" :isBack='true'/>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="isFind">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="到底啦"
        @load="onLoad"
        :immediate-check="false"
      >
        <van-cell-group>
          <van-cell
            v-for="item in booksList.content"
            :key="item._id"
            clickable
            center
          >
            <div class="bookList">
              <img :src="$store.state.imgPrefix+item.cover" alt style="width:25%;height:1.2rem" />
              <div class="info">
                <span class="title">{{item.title}}</span>
                <p class="brief">{{item.desc}}</p>
                <div class="author">
                  <div class="name">
                    <van-icon name="contact" size="18" color="gray" />
                    <span>{{item.author}}</span>
                  </div>
                  <div class="tag">
                    <van-tag type="warning">{{changeUnit(item.collectorCount)}}收藏</van-tag>
                    <van-tag type="danger">{{changeUnit(item.readCount)}}人气</van-tag>
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
import Nav from "../../components/Nav";
export default {
  created() {
    this.$store.commit("changeRead", true);

    this.title = this.$route.query.type;
    this.requestItem.gender = this.$route.query.gender;
    if(this.title == '一周最热'){
        this.requestItem.duration = 'last-seven-days',
        this.requestItem.sort = 'collectorCount'
    }else if(this.title =='最新发布'){
        this.requestItem.duration = 'all',
        this.requestItem.sort = 'created'
    }else{
         this.requestItem.duration = 'all',
        this.requestItem.sort = 'collectorCount'
    }
    this.$iHttp.get("/api/book-list", this.requestItem).then(res => {
      this.booksList.content = res.data.bookLists;
      this.booksList.total = res.data.total;
      if (this.booksList.content.length == 0) {
        this.isFind = false;
      }
    });
  },
  data() {
    return {
      title: "",
      booksList: {
        total: 0,
        content: []
      },
      requestItem: {
        gender: "",
        duration: "",
        sort: "",
        start: 0,
        limit: 20
      },
      loading: false,
      finished: false,
      refreshing: false,
      isFind: true
    };
  },
  methods: {
    onLoad() {
      if (this.refreshing) {
        //下拉刷新
        this.booksList.content = [];
        this.refreshing = false;
        this.requestItem.start = 0;
        this.isFind = true;
        this.$iHttp.get("/api/book-list", this.requestItem).then(res => {
          this.booksList.content = res.data.bookLists;
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
          .get("/api/book-list", this.requestItem)
          .then(res => {
            this.booksList.content.push(...res.data.bookLists);
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
    },
    changeUnit(val) {
      if (val >= 10000) {
        val = (val / 10000).toFixed(1) + "万";
      }
      return val;
    }
  },
  components: {
    Nav
  }
};
</script>


<style lang="scss" >
.activity {
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
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
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

