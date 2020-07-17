<template>
  <el-container style="height:100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1']" default-active="/articles/listArticle">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-tickets"></i>内容管理
          </template>
          <el-menu-item index="/articles/listArticle">文章列表</el-menu-item>
          <!-- <el-menu-item index="/articles/create">文章列表</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container class="container">
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.$router.replace("/auth");
    }
  }
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.container {
  position: relative;
}
.add {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 150px;
}
</style>