const express = require('express')
const app = express()
const port = 3000
app.use(require('cors')())
app.use(express.json())
app.listen(port, () => console.log(`Example app listening on port 3000!`))

const mongoose = require('mongoose')
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
  password: { type: String }
}))

app.get('/', (req, res) => res.send('Hello World!'))


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
      data: newUser
    })
  } else {
    res.send({
      code: 80002,
      message: "注册失败"
    })
  }
})


//新增文章
app.post('/api/articles', async (req, res) => {
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
app.put('/api/articles/:id', async (req, res) => {
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
app.delete('/api/articles/:id', async (req, res) => {
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
app.get('/api/articles', async (req, res) => {
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