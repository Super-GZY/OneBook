<template>
  <div class="home">
    <Nav />
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
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-tabs
          v-model="active"
          swipeable
          animated
          sticky
          offset-top="46"
          title-active-color="#f26552"
        >
          <van-tab v-for="(item,index) in tabList" :title="item.title" :key="index">
            <van-swipe class="my-swipe" :autoplay="4000" indicator-color="white">
              <van-swipe-item v-for="(item,index) in images" :key="index">
                <img :src="item" alt="">
              </van-swipe-item>
            </van-swipe>
            <van-grid :border="false" clickable>
              <van-grid-item icon="calender-o" text="一周最热" style="color:#f26552" @click="toActivity('一周最热',item.title)"/>
              <van-grid-item icon="new-arrival-o" text="最新发布" style="color:skyblue" @click="toActivity('最新发布',item.title)" />
              <van-grid-item icon="bookmark-o" text="最多收藏" style="color:red" @click="toActivity('最多收藏',item.title)" />
              <van-grid-item icon="vip-card" text="会员" style="color:gold" />
            </van-grid>
            <van-cell-group v-for="(value,index) in item.booksList" :key="index" style="border-top:7px solid #f6f7f9">
              <van-cell
                :title="value.title"
                value="更多"
                is-link
                :border="false"
                title-class="title"
                value-class="value"
              />
              <van-cell
                v-for="val in value.content"
                :key="val.book._id"
                clickable
                center
                :to="{path:'/detail',query:{id:val.book._id}}"
              >
                <div class="bookList">
                  <img :src="val.book.cover" alt style="width:25%;height:1.2rem" />
                  <div class="info">
                    <span class="title">{{val.book.title}}</span>
                    <p class="brief">{{val.book.shortIntro}}</p>
                    <div class="author">
                      <div class="name">
                        <van-icon name="contact" size="18" color="gray" />
                        <span>{{val.book.author}}</span>
                      </div>
                      <div class="tag">
                        <van-tag type="warning">{{val.book.retentionRatio.toFixed(0)+'%'}}留存</van-tag>
                        <van-tag type="danger">{{changeUnit(val.book.latelyFollower)}}人气</van-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-cell-group>
          </van-tab>
        </van-tabs>
      </van-pull-refresh>
    </template>
     <Footer v-if='!$store.state.isRead'/>

  </div>
</template>

<script>
import { Toast, Lazyload } from "vant";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default {
  name: "Home",
  created() {
    this.$store.commit("changeRead", false);

    //初始化书架推荐书籍
    if (!localStorage.getItem("OneBook_BookShelves")) {
      let books = [];
      this.$iHttp.get("/api/book/59ba0dbb017336e411085a4e").then(res => {
        let bookObj1 = {
          id: res.data._id,
          name: res.data.title,
          author: res.data.author,
          cover: res.data.cover,
          date: Date()
        };
        books.push(bookObj1);
        this.$iHttp.get("/api/book/550a8d84e3c0f94e375e4963").then(res => {
          let bookObj2 = {
            id: res.data._id,
            name: res.data.title,
            author: res.data.author,
            cover: res.data.cover,
            date: Date()
          };
          books.push(bookObj2);
          this.$iHttp.get("/api/book/50975b961db679b876000029").then(res => {
            let bookObj3 = {
              id: res.data._id,
              name: res.data.title,
              author: res.data.author,
              cover: res.data.cover,
              date: Date()
            };
            books.push(bookObj3);
            localStorage.setItem("OneBook_BookShelves", JSON.stringify(books));
          });
        });
      });
    }
    this.$iHttp
      .get("/api/recommendPage/nodes/5910018c8094b1e228e5868f")
      .then(res => {
        res.data.data.splice(1, 1);
        res.data.data.map((item, index) => {
          this.$iHttp.get("/api/recommendPage/books/" + item._id).then(res => {
            if (res.data.data) {
              if (res.data.data.length > 2) {
                res.data.data.splice(3);
              }
            }
            let obj = {
              title: item.title,
              content: res.data.data
            };
            if (item.title.indexOf("男") != -1) {
              if (obj.content) {
                this.tabList[0].booksList.push(obj);
              }
            } else {
              this.tabList[1].booksList.push(obj);
            }
          });
        });
      });
  },
  data() {
    return {
      value: "",
      images: [
        "https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/8a55de10b591a1c3e43512094eedb93b.jpg",
        "https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/037050753c254bb197b822e9e70bf032.jpg",
        "https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/8a55de10b591a1c3e43512094eedb93b.jpg",
        "https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/0f304220ccc56f038d40db413db0c533.jpg"
      ],
      active: 0,
      isLoading: true,
      tabList: [
        // {
        //   title: "精选"
        // },
        {
          title: "男频",
          booksList: []
        },
        {
          title: "女频",
          booksList: []
        }
        // {
        //   title: "出版"
        // },
        // {
        //   title: "会员"
        // }
      ]
    };
  },
  methods: {
    onRefresh() {
      this.tabList.map(item => {
        item.booksList = [];
      });
      this.$iHttp
        .get("/api/recommendPage/nodes/5910018c8094b1e228e5868f")
        .then(res => {
          this.isLoading = false;
          res.data.data.splice(1, 1);
          res.data.data.map((item, index) => {
            this.$iHttp
              .get("/api/recommendPage/books/" + item._id)
              .then(res => {
                if (res.data.data) {
                  if (res.data.data.length > 2) {
                    res.data.data.splice(3);
                  }
                }
                let obj = {
                  title: item.title,
                  content: res.data.data
                };
                if (item.title.indexOf("男") != -1) {
                  if (obj.content) {
                    this.tabList[0].booksList.push(obj);
                  }
                } else {
                  this.tabList[1].booksList.push(obj);
                }
              });
          });
        });
    },
    changeUnit(val) {
      if (val >= 10000) {
        val = (val / 10000).toFixed(1) + "万";
      }
      return val;
    },
    toActivity(type,gender){
      this.$router.push({
        path:'/activity',
        query:{
          type:type,
          gender:gender=='男频'?'male':'female'
        }
      })
    }
  },
  components: {
    Nav,
    Footer
  }
};
</script>


<style lang='scss'>
.my-swipe .van-swipe-item {
  // color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: center;
  // background-color: #39a9ed;
  img{
    width: 100%;
    // height: 1.7rem;
  }
}

.home {
  .value {
    font-weight: normal;
    font-size: 0.14rem;
    color: #f26552;
  }
  .title {
    font-size: 0.15rem;
    // border-left: 2px solid #f26552;
    // margin-left: 0.3rem;
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
