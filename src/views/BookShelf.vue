<template>
  <div class="bookshelf">
    <van-sticky>
      <form action="/">
        <van-search
          v-model="value"
          placeholder="搜索书架上的书"
          shape="round"
          clearable
          :show-action="isSearch"
          @search="search"
        >
          <template #action>
            <span @click="cancel">返回</span>
          </template>
        </van-search>
      </form>
    </van-sticky>
    <template v-if="!isEmpty">
      <van-grid :column-num="3" icon-size="100px" clickable center :border="false">
        <!-- <v-touch v-on:panstart="press">
              <img src="../assets/logo.png" alt="">
        </v-touch>-->
        <van-grid-item
          v-for="(item,index) in bookShelves"
          :key="index"
          :text="item.name"
          @click="entry(item.id)"
        >
          <template #text>
            <van-swipe-cell>
              <template #right>
                <van-icon
                  name="delete"
                  class="delete-button"
                  size="18px"
                  color="red"
                  @click="showConfirm(item.id)"
                />
              </template>
              <div class="info">
                <van-image
                  width="100"
                  height="140"
                  lazy-load
                  :src="$store.state.imgPrefix+item.cover"
                />
                <span class="name">{{item.name}}</span>
                <span class="author">{{item.author}}</span>
                <!-- <span class="date van-ellipsis">{{item.date.getFullYear()+'-'+(item.date.getMonth()+1)+'-'+item.date.getDate()}}加入</span> -->
              </div>
            </van-swipe-cell>
          </template>
        </van-grid-item>
        <van-grid-item v-if="!isSearch">
          <template #text>
            <div class="add" @click="$router.push('/selected')">
              <van-icon name="plus" />
              <!-- <span>看点别的</span> -->
            </div>
          </template>
        </van-grid-item>
      </van-grid>
      <van-dialog
        v-model="show"
        message="确认删除？"
        cancelButtonColor="red"
        show-cancel-button
        @confirm="deleteBooks"
        @cancel="show = false"
      ></van-dialog>
    </template>
    <van-empty
      v-else
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="没有这本书哦"
    />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("changeRead", false);
    this.bookShelves = JSON.parse(localStorage.getItem("OneBook_BookShelves"));
    // this.bookShelves.map(item => {
    //   item.date = new Date(item.date);
    //   //   console.log(item.date.getFullYear())
    //   //   console.log(item.date.getMonth());
    //   //   console.log(item.date.getDate());
    //   //   console.log(item.date.getHours());
    //   //   console.log(item.date.getMinutes());
    //   //   console.log(item.date.getSeconds());
    // });
  },
  data() {
    return {
      title: "书架",
      bookShelves: [],
      currentId: "",
      show: false,
      value: "",
      isSearch: false,
      isEmpty: false
    };
  },
  methods: {
    entry(id) {
      this.$router.push({ path: "/content", query: { id: id } });
      this.bookShelves = JSON.parse(
        localStorage.getItem("OneBook_BookShelves")
      );
      this.bookShelves.map((item, index) => {
        if (item.id == id) {
          this.bookShelves.unshift(this.bookShelves[index]);
          this.bookShelves.splice(index + 1, 1);
        }
      });
      localStorage.setItem(
        "OneBook_BookShelves",
        JSON.stringify(this.bookShelves)
      );
    },
    deleteBooks() {
      this.bookShelves.map((item, index) => {
        if (item.id === this.currentId) {
          this.bookShelves.splice(index, 1);
        }
      });
      localStorage.setItem(
        "OneBook_BookShelves",
        JSON.stringify(this.bookShelves)
      );
    },
    showConfirm(id) {
      this.show = true;
      this.currentId = id;
    },
    search(val) {
      let newBookShelves = [];
      this.isSearch = true;
      this.bookShelves.map(item => {
        newBookShelves.push(item.name);
      });
      let index = newBookShelves.indexOf(val);
      if (index != -1) {
        this.isEmpty = false;
        this.bookShelves = this.bookShelves.splice(index, 1);
      } else {
        this.isEmpty = true;
      }
    },
    cancel() {
      this.isSearch = false;
      this.isEmpty = false;
      this.value = "";
      this.bookShelves = JSON.parse(
        localStorage.getItem("OneBook_BookShelves")
      );
    }
  }
};
</script>


<style lang="scss" >
.bookshelf {
  .add {
    border: 2px solid #f5f5f5;
    border-radius: 3px;
    height: 1.5rem;
    width: 1rem;
    margin-bottom: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      font-size: 10px;
      color: grey;
    }
  }
  .delete-button {
    width: 0.5rem;
    height: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    // background-color: #f5f5f5;
  }
  .info {
    height: 1.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .delete {
      // width: 100%;
      position: absolute;
      top: 3px;
      right: 3px;
    }
    .name {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 1px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      //   width: 50%;
      //   border: 1px solid red
    }
    .author {
      font-size: 12px;
      color: grey;
    }
    .date {
      font-size: 12px;
      // color: red
    }
  }
}
</style>