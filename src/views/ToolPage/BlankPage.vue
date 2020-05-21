<template>
  <div class="blank"></div>
</template>

<script>
export default {
  created() {
    this.$router.push({
      path: "detail",
      query: {
        id: this.$route.query.id,
        up_id:this.$route.query.up_id,
        isBlank:true
      }
    });
  }
};
</script>