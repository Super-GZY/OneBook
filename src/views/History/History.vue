<template>
  <div class="history">
    <Nav :title="title" :isSimple="true" :isMine="true" :isBack='true'/>
    <van-button icon="brush-o" type="primary" style="position:fixed;top:50%;right:0;z-index:1;border:none;border-radius:50%;font-size:15px" color="#f26552" @click="clear"/>
    <van-list v-if="booksList.length !== 0">
      <van-cell-group>
        <van-cell
          v-for="item in booksList"
          :key="item._id"
          clickable
          center
          :to="{path:'/content',query:{id:item.id}}"
        >
          <div class="bookList">
            <img :src="$store.state.imgPrefix+item.cover" alt style="width:25%;height:1.2rem" />
            <div class="info">
              <span class="title">{{item.name}}<van-tag type="primary" style="float:right">第{{item.index}}章</van-tag></span>
              <p class="brief">{{item.longIntro}}</p>
              <div class="author">
                <div class="name">
                  <van-icon name="contact" size="18" color="gray" />
                  <span>{{item.author}}</span>
                </div>
                <div class="tag">
                  <van-tag type="warning">{{item.date}}观看过</van-tag>
                  <!-- <van-tag type="danger">上次看到第{{item.index}}章</van-tag> -->
                </div>
              </div>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="还没有阅读记录哦"
    />
  </div>
</template>

<script>
import Nav from "../../components/Nav";

export default {
  created() {
    if (localStorage.getItem("OneBook_ReadList")) {
      this.booksList = JSON.parse(localStorage.getItem("OneBook_ReadList"));
      this.booksList.map(item=>{
          item.date = new Date(item.date)
          item.date = item.date.getFullYear()+'-'+(Number(item.date.getMonth())+1)+'-'+item.date.getDate()
      })
    }
  },
  data() {
    return {
      booksList: [],
      title:'历史记录'
    };
  },
  methods:{
    clear(){
      localStorage.removeItem('OneBook_ReadList')
      this.booksList = []
      // this.$forceUpdate()
    }
  },
  components: {
    Nav
  }
};
</script>

<style lang="scss" >
.history {
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