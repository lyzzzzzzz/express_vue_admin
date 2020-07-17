<template>
  <div>
    <el-header class="header">
      <div>
        <el-button @click="setAddVisible(true)">新增</el-button>
        <el-button @click="toAddPage(false)">新增2</el-button>
        <el-button @click="clickUpdate">修改</el-button>
        <el-button @click="toAddPage(true)">修改2</el-button>
        <el-popconfirm title="确定删除吗？" style="marginLeft:10px" @onConfirm="clickdelete">
          <el-button slot="reference">删除</el-button>
        </el-popconfirm>
      </div>
      <el-popconfirm title="确定删除吗？" style="marginLeft:10px" @onConfirm="lagout">
        <span class="lagout" slot="reference">登出</span>
      </el-popconfirm>
    </el-header>

    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="title" label="文章标题" width="200px"></el-table-column>
      <el-table-column prop="content" label="文章内容"></el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="visible" width="30%">
      <el-form ref="form" @submit.native.prevent="saveArticle" :model="article" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="文章内容">
          <el-input v-model="article.content" type="textarea"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">{{isUdateAction?"更新":"立即创建"}}</el-button>
          <el-button @click="visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [],
      visible: false,
      currentRow: null,
      isUdateAction: false,
      article: {}
    };
  },
  computed: {
    title() {
      return this.isUdateAction ? "更新文章" : "新增文章";
    }
  },
  created() {
    this.getAticles();
  },
  methods: {
    lagout() {
      localStorage.removeItem('user')
       localStorage.removeItem('token')
       this.$router.replace("/auth")
    },
    toAddPage(isUpdate) {
      if (isUpdate) {
        if (!this.currentRow) {
          this.$message("请选择修改的项");
          return;
        }
        this.$router.push({
          path: "/articles/create",
          query: { currentRow: this.currentRow }
        });
      } else {
        this.$router.push("/articles/create");
      }
    },
    clickdelete() {
      if (!this.currentRow) {
        this.$message("请选择删除的项");
        return;
      }
      this.$http.delete("/articles/" + this.currentRow._id).then(res => {
        let { message } = res;
        this.$message({
          message,
          type: "success"
        });
        this.getAticles();
      });
    },
    clickUpdate() {
      if (!this.currentRow) {
        this.$message("请选择修改的项");
        return;
      }
      this.visible = true;
      this.isUdateAction = true;
      this.article = this.currentRow;
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
        let { code, message } = res;
        if (code === 80001) {
          this.$message({
            message,
            type: "success"
          });
        } else {
          this.$message.error(message);
        }
        this.article = {};
        this.visible = false;
        this.getAticles();
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setAddVisible(visible) {
      this.isUdateAction = false;
      this.article = {};
      this.visible = visible;
    },
    getAticles() {
      this.$http.get("/articles").then(res => {
        let { code, data } = res;
        if (code === 80001) {
          this.tableData = data.reverse();
        }
      });
    }
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
.header {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>