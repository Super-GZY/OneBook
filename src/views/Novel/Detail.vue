<template>
  <div class="detail">
    <Nav
      :title="title"
      :isBack="true"
      :path="path"
      :isBlank="$route.query.isBlank"
      :up_id="$route.query.up_id"
    />
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
      <template v-if="Object.keys(this.bookDetail).length != 0">
        <div class="content">
          <div class="info">
            <div
              class="bgi"
              :style="{background: 'url('+$store.state.imgPrefix+bookDetail.cover+')',backgroundSize: 'cover',filter: 'blur( 19px)'}"
            ></div>
            <div class="up_info">
              <van-image
                lazy-load
                class="cover"
                :src="$store.state.imgPrefix+bookDetail.cover"
                @click="$router.push({path:'/content',query:{id:bookDetail._id}})"
              />
              <!-- <img :src="$store.state.imgPrefix+bookDetail.cover" class="cover" /> -->
              <div class="text">
                <span class="name">{{bookDetail.title}}</span>
                <span class="author">
                  {{bookDetail.author}}
                  <span style="color:red">| {{bookDetail.copyright}}</span>
                </span>
                <span class="type">{{bookDetail.majorCate}}/{{bookDetail.minorCate}}</span>
                <span class="number">
                  {{bookDetail.wordCount}}字 |
                  <span
                    style="color:#f16c72"
                  >{{bookDetail.isSerial?'连载中':'完结'}}</span>
                </span>
                <div class="rating">
                  <van-rate v-model="bookDetail.rating.score" readonly />
                  <span class="count">{{bookDetail.rating.count}}人参加评论</span>
                </div>
              </div>
            </div>
          </div>
          <div class="brief">
            <van-cell-group :border="false">
              <van-cell>
                <div class="data">
                  <div class="day">
                    <span style="color:grey">留存率</span>
                    <span>{{bookDetail.retentionRatio}}%</span>
                  </div>
                  <div class="day">
                    <span style="color:grey">总人气</span>
                    <span>{{bookDetail.totalFollower}}</span>
                  </div>
                  <div class="day">
                    <span style="color:grey">日更字数/天</span>
                    <span>{{bookDetail.serializeWordCount}}</span>
                  </div>
                </div>
              </van-cell>
              <van-cell>
                <van-collapse v-model="activeNames" :border="false">
                  <van-collapse-item name="1" :border="false">
                    <p class="intro">{{bookDetail.longIntro}}</p>
                    <template #title>
                      <div>
                        <span style="font-size:15px">简介</span>
                        <van-tag
                          plain
                          round
                          type="primary"
                          size="large"
                          v-for="(item,index) in bookDetail.tags"
                          :key="index"
                        >{{item}}</van-tag>
                      </div>
                    </template>
                  </van-collapse-item>
                </van-collapse>
              </van-cell>
              <van-cell
                title="目录"
                title-style="color:grey"
                is-link
                :value="bookDetail.lastChapter"
                value-class="hidden"
                @click="$router.push({path:'/content',query:{id:bookDetail._id,isCate:true,chaptersCount:bookDetail.chaptersCount}})"
              />
              <van-cell
                :border="false"
                value="查看全部评论"
                :title="'近期书评 | '+bookComment.total+'条'"
                title-style="font-weight:400"
                is-link
              />
              <van-cell v-for="(item,index) in this.bookComment.reviews" :key="index">
                <div class="comment">
                  <van-image
                    lazy-load
                    width="0.4rem"
                    height="0.4rem"
                    :src="$store.state.imgPrefix+item.author.avatar"
                  />
                  <div class="content">
                    <div class="head">
                      <span class="name">{{item.author.nickname}}</span>
                      <span class="data">{{item.created.slice(0, 10)}}</span>
                    </div>
                    <div class="title">
                      <span class="til">{{item.title}}</span>
                      <div class="like">
                        <van-icon :name="item.dz" size="15" @click="like(index)" />
                        <span>{{item.likeCount}}</span>
                      </div>
                    </div>
                    <div class="detail">
                      <p>{{item.content}}</p>
                    </div>
                  </div>
                </div>
              </van-cell>
              <van-cell
                title="同类推荐"
                title-style="font-weight:400"
                value="更多"
                isLink
                :border="false"
              />
              <van-cell>
                <van-grid :column-num="4" :border="false" class="recommend">
                  <van-grid-item
                    v-for="(item ,index) in randomRecommend"
                    :key="index"
                    @click="$router.push({path:'/blank',query:{id:item._id,up_id:$route.query.id}})"
                  >
                    <template #icon>
                      <van-image
                        lazy-load
                        width="0.65rem"
                        height="0.9rem"
                        :src="$store.state.imgPrefix+item.cover"
                      />
                    </template>
                    <template #text>
                      <span class="title">{{item.title}}</span>
                      <span class="other">{{item.otherReadRatio}}%读过</span>
                    </template>
                  </van-grid-item>
                </van-grid>
                <div class="change" @click="random">
                  <span>换一换</span>
                  <van-icon name="replay" />
                </div>
              </van-cell>
            </van-cell-group>
          </div>
          <van-tabbar v-model="active" route placeholder inactive-color="#f26552">
            <van-tabbar-item style="color:grey;font-size:15px" @click="addBookshelves"><span>{{isAdd?'已在书架':'加入书架'}}</span></van-tabbar-item>
            <van-tabbar-item :to="{path:'/content',query:{id:bookDetail._id}}" style="background-color:#f26552;color:#fff;font-size:15px">立即阅读</van-tabbar-item>
          </van-tabbar>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
export default {
  created() {
      let books = JSON.parse(localStorage.getItem("OneBook_BookShelves"));
    books.map(item => {
      if (item.id ==  this.$route.query.id) {
        this.isAdd = true;
      }
    });
    this.$store.commit("changeRead", true);
    this.$iHttp.get("/api/book/" + this.$route.query.id).then(res => {
      res.data.wordCount = this.changeUnit(res.data.wordCount);
      res.data.latelyFollower = this.changeUnit(res.data.latelyFollower);
      res.data.totalFollower = this.changeUnit(res.data.totalFollower);
      res.data.rating.count = this.changeUnit(res.data.rating.count);
      res.data.rating.score = res.data.rating.score / 2;
      res.data.tags.splice(4);
      res.data.updated = res.data.updated.slice(0, 10);
      this.bookDetail = res.data;
    });

    this.$iHttp
      .get("/api/post/review/best-by-book", {
        book: this.$route.query.id,
        limit: 3
      })
      .then(res => {
        res.data.reviews.map(item => (item.dz = this.dz));
        this.bookComment.total = res.data.total;
        this.bookComment.reviews = res.data.reviews;
      });

    this.$iHttp
      .get("/api/book/" + this.$route.query.id + "/recommend")
      .then(res => {
        this.recommend = res.data.books;
        this.random();
      });
  },
  data() {
    return {
      active: "",
      title: "详情",
      path: "/selected",
      bookDetail: {},
      bookComment: {
        total: 0,
        reviews: []
      },
      recommend: [],
      randomRecommend: [],
      activeNames: ["1"],
      dz: "good-job-o",
      isAdd:false
    };
  },
  methods: {
    changeUnit(val) {
      if (val >= 10000) {
        val = (val / 10000).toFixed(1) + "万";
      }
      return val;
    },
    random() {
      this.randomRecommend = [];
      let idxArr = [];
      while (idxArr.length < 4) {
        let index = Math.floor(Math.random() * this.recommend.length);
        if (idxArr.indexOf(index) === -1) {
          idxArr.push(index);
        }
      }
      idxArr.map(item => this.randomRecommend.push(this.recommend[item]));
    },
    like(idx) {
      if (this.bookComment.reviews[idx].dz !== "good-job") {
        this.bookComment.reviews[idx].dz = "good-job";
        this.bookComment.reviews[idx].likeCount += 1;
      } else {
        this.bookComment.reviews[idx].dz = "good-job-o";
        this.bookComment.reviews[idx].likeCount -= 1;
      }
    },
     addBookshelves() {
      if (!this.isAdd) {
        this.$iHttp.get("/api/book/" + this.$route.query.id).then(res => {
          let books = JSON.parse(localStorage.getItem("OneBook_BookShelves"));
          let bookObj = {
            id: this.$route.query.id,
            name: res.data.title,
            author: res.data.author,
            cover: res.data.cover,
            date: Date()
          };
          books.unshift(bookObj);
          localStorage.setItem("OneBook_BookShelves", JSON.stringify(books));
          this.isAdd = true;
        });
      }
    },
  },
  components: {
    Nav
  }
};
</script>


<style lang="scss" >
.detail {
  .hidden {
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }
  .content {
    width: 100%;
    .info {
      width: 100%;
      height: 2rem;
      display: flex;
      .bgi {
        width: 100%;
        height: 100%;
      }
      .up_info {
        position: absolute;
        width: 100%;
        height: 2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .cover {
          width: 1.1rem;
          height: 1.5rem;
          border-radius: 3px;
        }
        .text {
          width: 56%;
          height: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          span {
            font-size: 13px;
          }
          .name {
            font-size: 18px;
            font-weight: normal;
            color: #000;
            letter-spacing: 2px;
          }
          .author {
            color: goldenrod;
          }

          .rating {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            span {
              font-size: 12px;
              //   color: grey
            }
          }
        }
      }
    }
    .brief {
      .data {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .day {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          span {
            font-size: 14px;
            font-weight: 300;
            letter-spacing: 1px;
          }
        }
      }
      .van-tag {
        margin-left: 0.1rem;
      }
      .intro {
        // font-size: 12px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }
      .comment {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .content {
          width: 86%;
          height: 1.3rem;
          .head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .name {
              color: #b5a642;
              font-size: 12px;
            }
            .data {
              color: grey;
              font-size: 12px;
            }
          }
          .title {
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .til {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              width: 60%;
            }
            .like {
              width: 12%;
              display: flex;
              align-items: center;
              justify-content: space-around;
            }
          }
          .detail {
            p {
              font-size: 12px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
          }
        }
      }
      .recommend {
        .other {
          color: grey;
          font-size: 10px;
        }
        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
      .change {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          color: #ff2400;
        }
        .van-icon {
          color: #ff2400;
          margin-left: 0.1rem;
        }
      }
    }
  }
}
</style>