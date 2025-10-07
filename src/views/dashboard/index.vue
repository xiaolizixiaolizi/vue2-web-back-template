<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon icon-class="password" style="color: red; font-size: 34px" />
    <div class="aa">434</div>
  </div>
</template>

<script>

export default {
  name: "Dashboard",
  computed: {
    name() {
      return this.$store.state.user.userInfo.username
    },
  },
  data(){
    return {}
  },
  created(){
   
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .aa {
      color: red;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
