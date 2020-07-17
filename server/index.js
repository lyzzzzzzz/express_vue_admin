const express = require('express')
const app = express()
const port = 3000
const SRCRET = "SLJMM;LDSF"  //模拟秘钥
const jwt = require('jsonwebtoken') //生成token
const mongoose = require('mongoose')

app.use(require('cors')())
app.use(express.json())
app.listen(port, () => console.log(`Example app listening on port 3000!`))


mongoose.connect('mongodb://localhost:27017/express-vue-admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
})
//创建Article表
const Article = mongoose.model('Article', new mongoose.Schema({
  title: { type: String },
  content: { type: String }
}))

//创建User表
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      return require('bcrypt').hashSync(val, 10)//npm i bcrypt  加密
    }
  }
}))


//中间件,使得可以共用，不用每个接口都写一个token验证
const auth = async (req, res, next) => {
  const law = String(req.headers.authorization)
  if(!law){
    return res.send({
      code:80003,
      message: "token过期，请重新登录"
    })
  }
  const { id } = jwt.verify(law, SRCRET)//拿出存进token里面的id
  req.user = await User.findById(id)
  next()
}


app.get('/', (req, res) => res.send('Hello World!'))



app.post('/api/users/login', async (req, res) => {
  const reqData = req.body  //前端提交过来用户
  const user = await User.findOne({  //数据库查询出来用户
    username: reqData.username
  })
  if (!user) {
    return res.send({
      code: 80002,
      message: "用户不存在"
    })
  }

  //验证密码
  const isPwdValid = require('bcrypt').compareSync(reqData.password, user.password)
  if (!isPwdValid) {
    return res.send({
      code: 80002,
      message: "密码不正确"
    })
  }

  //生成token
  const token = jwt.sign({
    id: String(user._id)
  }, SRCRET)


  res.send({
    code: 80001,
    message: "登录成功",
    user,
    token
  })

})


//注册
app.post('/api/users/register', async (req, res) => {
  const user = req.body
  const reg = await User.findOne({
    username: user.username
  })

  if (reg) {
    return res.send({
      code: 80002,
      message: "用户名已存在"
    })
  }
  const newUser = await User.create({
    username: user.username,
    password: user.password
  })
  if (newUser) {
    res.send({
      code: 80001,
      message: "注册成功",
      user: newUser
    })
  } else {
    res.send({
      code: 80002,
      message: "注册失败"
    })
  }
})


//新增文章
app.post('/api/articles',auth, async (req, res) => {
  const article = await Article.create(req.body)
  if (article) {
    res.send({
      code: 80001,
      message: "文章创建成功",
      data: article
    })
  } else {
    res.send({
      code: 80002,
      message: "文章创建失败"
    })
  }
})


//修改文章
app.put('/api/articles/:id',auth, async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article) {
    article.title = req.body.title
    article.content = req.body.content
    await article.save()
    res.send({
      code: 80001,
      message: "文章更新成功",
      data: article
    })
  } else {
    res.send({
      code: 80002,
      message: "文章更新失败"
    })
  }
})


//删除文章
app.delete('/api/articles/:id',auth, async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article) {
    await article.remove()
    res.send({
      code: 80001,
      message: "文章删除成功"
    })
  } else {
    res.send({
      code: 80002,
      message: "文章删除失败"
    })
  }
})


//文章列表
app.get('/api/articles',auth, async (req, res) => {
  const article = await Article.find()
  if (article) {
    res.send({
      code: 80001,
      message: "成功",
      data: article
    })
  } else {
    res.send({
      code: 80002,
      message: "失败"
    })
  }
})