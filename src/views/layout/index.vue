<template>
  <!-- <div class="layout-erap">
      <AppAside/>
      <AppHeader/>
  </div> -->
  <el-container>
  <el-aside width="200px">
      <!-- 侧边栏 -->
      <AppAside/>
  </el-aside>
  <el-container>
      <!-- 头部 -->
    <el-header>
        <AppHeader/>
    </el-header>
    <!-- 内容 -->
    <el-main>
        <!-- Home ,发布文章，文章列表，品论 -->
        <router-view/>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.el-container {
    height: 100%;
}
.el-aside {
    background-color: #343a46;
}
.el-header {
    background-color: #aec0d1;
}
.el-main {
    background-color: #f3f4f6;
}
</style>
