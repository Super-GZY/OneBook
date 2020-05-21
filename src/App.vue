<template>
  <div id="app">
    <router-view />
    <Footer v-if='!$store.state.isRead'/>
  </div>
</template>
<script>
import Footer from "./components/Footer";
export default {
  data() {
    return {};
  },
  components: {
    Footer
  }
};
</script>

<style lang='scss'>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
