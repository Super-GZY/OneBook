<template>
  <div class="content">
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
      <template v-if="!isVip">
        <div class="detail" @click="changeStatus" :style="{backgroundColor:currentColor}">
          <div class="wz">
            <p
              class="page"
              v-for="(item,index) in chapterContent.cpContent"
              :key="index"
              :style="{fontSize:currentSize+'px'}"
            >{{item}}</p>
          </div>
          <div style="height:0.3rem"></div>
        </div>
      </template>
      <template v-else>
        <div
          class="noVip"
          @click="changeStatus"
          :style="{backgroundColor:currentColor,height:screenHeight+'px'}"
        >
          <div class="content">VIP</div>
        </div>
      </template>
      <transition name="van-slide-down">
        <div v-show="visible" class="top">
          <van-nav-bar :border="false">
            <template #left>
              <van-icon name="arrow-left" size="18" color="#fff" @click="back" />
            </template>
            <template #title>
              <span class="title">{{chapterContent.title}}</span>
            </template>
            <template #right>
              <van-icon
                name="eye-o"
                size="22"
                color="#fff"
                @click="eyes"
                v-if="currentColor != '#1a1a1a'"
              />
              <van-icon name="closed-eye" size="22" color="#fff" @click="eyes" v-else />
            </template>
          </van-nav-bar>
        </div>
      </transition>
      <transition name="van-slide-up" v-if="!isSetting">
        <div v-show="visible" class="bottom">
          <div class="chapter_btn">
            <div class="btn">
              <span @click="btnChangeChapter('-')">上一章</span>
              <!-- <van-slider v-model="currentChapter" :min="1" :max="50" active-color="#ee0a24" button-size='15px' :disabled='true'/> -->
              <span @click="btnChangeChapter('+')">下一章</span>
            </div>
          </div>
          <van-nav-bar :border="false">
            <template #left>
              <div class="catalog" @click="isCatalog?isCatalog=false:isCatalog=true">
                <img src="../../assets/catlog.png" alt />
                <span>目录</span>
              </div>
            </template>
            <template #title>
              <span style="color:#fff" @click="goHome">OneBook</span>
            </template>
            <template #right>
              <div class="setting-o" @click="isSetting?isSetting=false:isSetting=true">
                <van-icon name="setting-o" size="20" color="#fff" />
                <span>设置</span>
              </div>
            </template>
          </van-nav-bar>
          <div style="height:0.05rem;background-color: #13130f"></div>
        </div>
      </transition>
      <transition name="van-slide-right">
        <div v-show="visible" class="right" @click="addBookshelves">
          <span>{{isAdd?'已在书架':'加入书架'}}</span>
        </div>
      </transition>
      <van-popup v-model="isSetting" position="bottom" :overlay="false" class="setting" round>
        <div class="wordSzie">
          <div class="sub" @click="changeSize('-')">A-</div>
          <div class="add" @click="changeSize('+')">A+</div>
        </div>
        <div class="color">
          <div
            class="content"
            v-for="(item,index) in colorList"
            :key="index"
            :style="{backgroundColor:item,border: item == currentColor?'1px solid #ed414a':''}"
            @click="changeBgc(item)"
          >
            <van-icon name="success" color="#ed414a" v-show="item == currentColor" />
          </div>
        </div>
        <div style="color:#fff">OneBook</div>
      </van-popup>
      <van-popup v-model="isCatalog" position="left" class="drawer" round>
        <van-cell-group>
          <van-cell>
            <template #title>
              <div class="mulu">
                <span>目录</span>
              </div>
            </template>
            <template #default>
              <div class="number van-ellipsis">
                <span>{{bookContent.bookName}}</span>
              </div>
            </template>
          </van-cell>
          <van-cell v-for="item in bookContent.chapters" :key="item._id">
            <div class="zj" @click="changeChapter(item.link,item.order)">
              <span class="van-ellipsis">{{item.title}}</span>
              <van-icon name="shopping-cart-o" v-show="item.isVip" size="19" color="goldenrod" />
            </div>
          </van-cell>
        </van-cell-group>
      </van-popup>
    </template>
  </div>
</template>


<script>
import axios from "axios";
export default {
  created() {
    this.screenHeight = window.screen.height * 0.81;
    this.$store.commit("changeRead", true);
    let id = this.$route.query.id;

    if (!localStorage.getItem("OneBook_Theme")) {
      let color = "#c4b395";
      localStorage.setItem("OneBook_Theme", color);
    } else {
      this.currentColor = localStorage.getItem("OneBook_Theme");
    }
    if (!localStorage.getItem("OneBook_Size")) {
      let size = 15;
      localStorage.setItem("OneBook_Size", size);
    } else {
      this.currentSize = Number(localStorage.getItem("OneBook_Size"));
    }

    let books = JSON.parse(localStorage.getItem("OneBook_BookShelves"));
    books.map(item => {
      if (item.id == id) {
        this.isAdd = true;
      }
    });

    this.$iHttp
      .get("/api/btoc", {
        view: "summary",
        book: id
      })
      .then(res => {
        this.tocContent = res.data;
        this.$iHttp
          .get("/api/btoc/" + res.data[0]._id, {
            view: "chapters",
            channel: "mweb"
          })
          .then(res => {
            this.bookContent = res.data;
            let isCate = this.$route.query.isCate;
            this.currentChapter = isCate ? res.data.chapters.length : 1; //是否定位到最后一个目录
            this.chapterContent.title = this.bookContent.chapters[
              isCate ? res.data.chapters.length - 1 : 0
            ].title;
            this.$iHttp
              .get(
                "/chapterApi" +
                  res.data.chapters[this.currentChapter - 1].link.slice(28)
              )
              .then(res => {
                this.isVip = false;
                this.chapterContent = res.data.chapter;
                this.chapterContent.cpContent = this.chapterContent.cpContent.split(
                  "\r\n"
                );
                this.currentChapter = this.chapterContent.order;
              })
              .catch(err => {
                this.isVip = true;
              });
          });
      });
    //添加历史记录
    if (!localStorage.getItem("OneBook_ReadList")) {
      this.$iHttp.get("/api/book/" + id).then(res => {
        let books = [];
        let bookObj = {
          id: id,
          name: res.data.title,
          author: res.data.author,
          cover: res.data.cover,
          date: Date(),
          longIntro: res.data.longIntro,
          index: this.currentChapter
        };
        books.unshift(bookObj);
        localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
      });
    } else {
      let books = JSON.parse(localStorage.getItem("OneBook_ReadList"));
      let isExistence = false;
      let idx = 0;
      books.map((item, index) => {
        if (item.id == id) {
          isExistence = true;
          idx = index;
        }
      });
      if (isExistence) {
        if (!this.$route.query.isCate) {
          if (books[idx].index > 1) {
            this.$dialog
              .confirm({
                message: "要回到上次阅读章节吗？",
                closeOnPopstate: true
              })
              .then(res => {
                this.changeChapter(
                  this.bookContent.chapters[books[idx].index - 1].link,
                  books[idx].index
                );
                books[idx].date = Date();
                books.unshift(books[idx]);
                books.splice(idx + 1, 1);
                localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
              })
              .catch(err => {
                books[idx].index = 1;
                books[idx].date = Date();
                books.unshift(books[idx]);
                books.splice(idx + 1, 1);
                localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
              });
          } else {
            books[idx].date = Date();
            books.unshift(books[idx]);
            books.splice(idx + 1, 1);
            localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
          }
        } else {
          books[idx].index = this.$route.query.chaptersCount;
          books[idx].date = Date();
          books.unshift(books[idx]);
          books.splice(idx + 1, 1);
          localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
        }
      } else {
        this.$iHttp.get("/api/book/" + id).then(res => {
          let bookObj = {
            id: id,
            name: res.data.title,
            author: res.data.author,
            cover: res.data.cover,
            date: Date(),
            longIntro: res.data.longIntro,
            index: this.currentChapter
          };
          books.unshift(bookObj);
          localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
        });
      }
    }
  },
  data() {
    return {
      isVip: false,
      tocContent: [],
      bookContent: {},
      chapterContent: {},
      visible: true,
      isSetting: false,
      isCatalog: false,
      colorList: [
        "#c4b395",
        "#c3d4e5",
        "#c8e8c8",
        "#f8c9c9",
        "#3e4349",
        "#f6f7f5"
      ],
      currentColor: "#c4b395",
      currentSize: 15,
      currentChapter: 1,
      isAdd: false,
      screenHeight: 0
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    btnChangeChapter(type) {
      if (type == "+") {
        if (this.currentChapter < this.tocContent[0].chaptersCount) {
          this.currentChapter += 1;
          this.chapterContent.title = this.bookContent.chapters[
            this.currentChapter - 1
          ].title;
          let books = JSON.parse(localStorage.getItem("OneBook_ReadList"));
          books.map((item, index) => {
            if (item.id == this.$route.query.id) {
              item.index = this.currentChapter;
            }
          });
          localStorage.setItem("OneBook_ReadList", JSON.stringify(books));

          this.$iHttp
            .get(
              "/chapterApi" +
                this.bookContent.chapters[this.currentChapter - 1].link.slice(
                  28
                )
            )
            .then(res => {
              //   this.visible = false;
              this.isVip = false;
              this.chapterContent = res.data.chapter;
              this.chapterContent.cpContent = this.chapterContent.cpContent.split(
                "\r\n"
              );
            })
            .catch(err => {
              this.chapterContent.title = this.bookContent.chapters[
                this.currentChapter - 1
              ].title;
              this.isVip = true;
            });
        }
      } else {
        if (this.currentChapter > 1) {
          this.currentChapter -= 1;
          this.chapterContent.title = this.bookContent.chapters[
            this.currentChapter - 1
          ].title;
          let books = JSON.parse(localStorage.getItem("OneBook_ReadList"));
          books.map((item, index) => {
            if (item.id == this.$route.query.id) {
              item.index = this.currentChapter;
            }
          });
          localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
          this.$iHttp
            .get(
              "/chapterApi" +
                this.bookContent.chapters[this.currentChapter - 1].link.slice(
                  28
                )
            )
            .then(res => {
              //   this.visible = false;
              this.isVip = false;
              this.chapterContent = res.data.chapter;
              this.chapterContent.cpContent = this.chapterContent.cpContent.split(
                "\r\n"
              );
            })
            .catch(err => {
              this.chapterContent.title = this.bookContent.chapters[
                this.currentChapter - 1
              ].title;
              this.isVip = true;
            });
        }
      }
    },
    changeChapter(link, order) {
      let books = JSON.parse(localStorage.getItem("OneBook_ReadList"));
      books.map((item, index) => {
        if (item.id == this.$route.query.id) {
          item.index = order;
        }
      });
      localStorage.setItem("OneBook_ReadList", JSON.stringify(books));
      this.chapterContent.title = this.bookContent.chapters[order - 1].title;
      this.$iHttp
        .get("/chapterApi" + link.slice(28))
        .then(res => {
          this.visible = false;
          this.isVip = false;
          this.chapterContent = res.data.chapter;
          this.chapterContent.cpContent = this.chapterContent.cpContent.split(
            "\r\n"
          );
          this.currentChapter = this.chapterContent.order;
        })
        .catch(err => {
          this.currentChapter = order;
          this.chapterContent.title = this.bookContent.chapters[
            order - 1
          ].title;

          this.isVip = true;
        });
    },
    changeBgc(col) {
      this.currentColor = col;
      localStorage.setItem("OneBook_Theme", this.currentColor);
    },
    changeSize(status) {
      if (status == "-") {
        if (this.currentSize > 12) {
          this.currentSize -= 3;
          localStorage.setItem("OneBook_Size", this.currentSize);
        }
      } else {
        if (this.currentSize < 24) {
          this.currentSize += 3;
          localStorage.setItem("OneBook_Size", this.currentSize);
        }
      }
    },
    changeStatus() {
      this.visible ? (this.visible = false) : (this.visible = true);
      if (this.isSetting) {
        this.isSetting ? (this.isSetting = false) : (this.isSetting = true);
      }
    },
    eyes() {
      if (this.currentColor !== "#1a1a1a") {
        this.currentColor = "#1a1a1a";
        localStorage.setItem("OneBook_Theme", this.currentColor);
      } else {
        this.currentColor = "#c4b395";
        localStorage.setItem("OneBook_Theme", this.currentColor);
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
    goHome() {
      this.$router.push("/");
      this.$store.commit("changeRead", false);
    }
  },
  components: {}
};
</script>


<style lang="scss" scoped>
.content {
  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .detail {
    background-color: #c4b395;
    .chapter {
      color: #1d1b17;
      margin-left: 0.1rem;
    }
    .wz {
      display: flex;
      flex-direction: column;
      align-items: center;
      .page {
        text-indent: 2em;
        color: #5d5647;
        font-size: 15px;
        width: 90%;
        margin: 0 auto;
        margin-top: 0.1rem;
        line-height: 0.3rem;
      }
    }
  }
  .noVip {
    background-color: #c4b395;
    height: 6.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 50%;
      height: 0.5rem;
      border: 2px solid goldenrod;
      border-radius: 10px;
      box-shadow: 1px 0px 3px goldenrod;
      text-align: center;
      line-height: 0.5rem;
      color: gold;
      font-size: 30px;
      letter-spacing: 0.1rem;
    }
  }
  .top {
    position: fixed;
    top: 0;
    width: 100%;
    .van-nav-bar {
      height: 0.45rem;
      background-color: #13130f;
      .title {
        color: #fff;
        letter-spacing: 0.01rem;
        font-weight: normal;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    .van-nav-bar {
      height: 0.5rem;
      background-color: #13130f;
      .catalog {
        display: flex;
        flex-direction: column;
        img {
          width: 0.25rem;
          height: 0.25rem;
        }
        span {
          color: #fff;
          font-size: 13px;
        }
      }
      .title {
        color: #fff;
        letter-spacing: 0.01rem;
        font-weight: normal;
      }
      .setting-o {
        margin-top: 0.12rem;
        display: flex;
        flex-direction: column;
        span {
          color: #fff;
          font-size: 13px;
        }
      }
    }

    .chapter_btn {
      height: 0.45rem;
      background-color: #13130f;
      border-bottom: 1px solid darkgrey;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          color: #fff;
          font-size: 14px;
        }
        .van-slider {
          width: 65%;
        }
      }
    }
  }

  .right {
    position: fixed;
    top: 20%;
    right: 0;
    width: 1rem;
    height: 0.4rem;
    background-color: #13130f;
    text-align: center;
    line-height: 0.4rem;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    span {
      color: #fff;
    }
  }
  .setting {
    height: 23%;
    background-color: #13130f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .wordSzie {
      color: #fff;
      width: 90%;
      display: flex;
      justify-content: space-around;
      .sub {
        width: 35%;
        height: 0.3rem;
        border: 1px solid gray;
        border-radius: 5px;
        text-align: center;
        line-height: 0.3rem;
      }
      .add {
        width: 35%;
        height: 0.3rem;
        border: 1px solid gray;
        border-radius: 5px;
        text-align: center;
        line-height: 0.3rem;
      }
    }
    .color {
      width: 90%;
      display: flex;
      justify-content: space-around;
      .content {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        text-align: center;
        line-height: 0.35rem;
      }
    }
  }
  .drawer {
    height: 100%;
    width: 60%;
    background-color: #f5f5f5;
    .mulu {
      //   text-align: center;
      letter-spacing: 0.1rem;
      font-size: 15px;
    }
    .number {
      //   letter-spacing: 0.05rem;
      font-size: 13px;
    }
    .zj {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        width: 85%;
      }
    }
  }
}
</style>

