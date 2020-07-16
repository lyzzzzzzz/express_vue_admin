<template>
  <el-form ref="form" @submit.native.prevent="saveArticle" :model="article" label-width="80px">
    <el-form-item label="文章标题">
      <el-input v-model="article.title"></el-input>
    </el-form-item>

    <el-form-item label="文章内容">
      <el-input v-model="article.content" type="textarea"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit">{{isUdateAction?"更新":"立即创建"}}</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      isUdateAction: false,
      currentRow: null
    };
  },
  created() {
    let data = this.$route.query.currentRow;
    if (data) {
      this.isUdateAction = true;
      this.article = data;
      this.currentRow = data;
    }
  },
  methods: {
    cancelBtn() {
      this.$router.push("/articles/index");
    },
    saveArticle() {
      let { title, content } = this.article;
      if (!title) {
        this.$message("标题不能为空");
        return;
      }
      if (!content) {
        this.$message("内容不能为空");
        return;
      }
      let url = "";
      let method = "";
      if (this.isUdateAction) {
        url = "/articles/" + this.currentRow._id;
        method = "put";
      } else {
        url = "/articles";
        method = "post";
      }

      this.$http({
        url,
        method,
        data: this.article
      }).then(res => {
        let { code, message } = res.data;
        if (code === 80001) {
          this.$message({
            message,
            type: "success"
          });
        } else {
          this.$message.error(message);
        }
        this.article = {};
        this.$router.push("/articles/index");
      });
    }
  }
};
</script>

<style>
</style>