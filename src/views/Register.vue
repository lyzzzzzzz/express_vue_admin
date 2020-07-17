<template>
  <div class="contianer">
    <h2 style="textAlign:center">{{title}}</h2>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="姓名" prop="name">
        <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" v-if="isRegister">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{isRegister?'注册':'登录'}}</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <span style="marginLeft:200px;color:blue" @click="changeStatus">{{!isRegister?'注册':'登录'}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  computed: {
    title() {
      return this.isRegister ? "注册" : "登录";
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        name: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }]
      },
      isRegister: false
    };
  },
  methods: {
    changeStatus() {
      this.isRegister = !this.isRegister;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            username: this.ruleForm.name,
            password: this.ruleForm.pass
          };

          let url = "";
          if (this.isRegister) {
            url = "/users/register";
          } else {
            url = "/users/login";
          }

          this.$http.post(url, data).then(res => {
            let { code, message, user, token } = res;
            if (code === 80001) {
              this.$message({
                message,
                type: "success"
              });

              if (!this.isRegister) {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                this.$router.push("/articles/index");
              } else {
                this.isRegister = false;
              }
              // localStorage.setItem("user", JSON.stringify(data));
            } else {
              this.$message({
                message,
                type: "error"
              });
            }
            this.ruleForm = {};
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.contianer {
  width: 500px;
  margin: 0 auto;
  border: 1px solid rosybrown;
  margin-top: 200px;
  padding: 50px;
}
</style>