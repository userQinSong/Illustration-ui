<template>
  <div style="padding: 0"
       class="rt-songs"
  >
    <div class="main-page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPage"
}
</script>

<style scoped>
  .rt-songs {
    text-align: center;
  }
  .main-page {
    display: inline-block;
    max-width: 1700px;
    min-width: 1200px;
    margin-top: 10px;
    padding: 10px 22px 5px 22px;
  }
</style>
