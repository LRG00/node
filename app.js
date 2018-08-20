const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const DB_URL = 'mongodb://leeruigan:as123456@ds119702.mlab.com:19702/blog'
mongoose.connect(DB_URL)
mongoose.connection.on('connected', () => console.log('已启动mongo'))
// 初始化app
const app = express()
// Body Parser 中间件
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// 解析 application/json
app.use(bodyParser.json())
// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')))
// 设置模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// 引入article models
const Article = require('./models/article')
// 引入user models
const User = require('./models/user')
// // 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }))
// 路由
app.get('/', function (req, res) {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', { title: '文章管理', articles })
    }
  })
})

app.get('/articles', function (req, res) {
  res.render('add_article', { title: '文章列表' })
})

app.get('/articles/add', function (req, res) {
  console.log(req.query.id)
  Article.findOne({_id: req.query.id}, (err, article) => {
    if (err) {
      console.log(err)
    } else {
      res.render('add_article', { article: article || {} })
    }
  })
})
app.post('/articles/add', function (req, res) {
  const { title, author, content } = req.body
  const article = new Article()
  article.title = title
  article.author = author
  article.content = content
  article.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
})
app.post('/signup', function (req, res) {
  console.log(req.body, '000000000000000000000000000000000000000000000000000')
  // const { name } = req.body
  const { name, password, avatar, gender, bio } = req.body
  const user = new User()
  user.name = name
  user.password = password
  user.avatar = avatar
  user.gender = gender
  user.bio = bio
  user.save(err => {
    if (err) {
      console.log(err)
    } else {
      res.send({ code: 200 })
    }
  })
})
app.get('/login', function (req, res, next) {
  res.render('login')
})
app.post('/login', function (req, res, next) {
  User.findOne({ name: req.body.name }, (err, userinfo) => {
    if (err) {
      console.log(err)
    } else {
      if (userinfo && userinfo.name === req.body.name && userinfo.password === req.body.password) {
        console.log(userinfo)
        res.redirect('/')
      } else {
        res.send({ code: 0 })
      }
    }
  })
})
// 启动服务
app.listen(3200, function () {
  // console.log(process.env.NODE_ENV)
  console.log('Server started on port 3000...')
})
