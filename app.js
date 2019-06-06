var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')

// firebase
var admin = require("firebase-admin")
var serviceAccount = require("./testproject-a9962-firebase-adminsdk-jlp61-7c73e17dc7.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testproject-a9962.firebaseio.com"
})

var fireData = admin.database()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//路由
app.get('/',function(req,res){
  fireData.ref('todos').once('value', function(snapshot) {
    let data = snapshot.val()
    let num
    if(data) {
      num = Object.keys(data).length
    } else {
      data = []
      num = 0
    }
    res.render('index', { 'todolist': data, 'num': num})
  })
})

// 新增
app.post('/addTodo', function(req, res) {
  let content = req.body.content
  let contentRef = fireData.ref('todos').push()
  contentRef.set({ 'content': content })
    .then(() => {
      fireData.ref('todos').once('value', function(snapshot) {
        res.send({
          success: true,
          result: snapshot.val(),
          msg: '新增成功'
        })
      })
    })
})

// 刪除
app.post('/removeTodo', function(req, res) {
  let tid = req.body.id
  fireData.ref('todos').child(tid).remove()
    .then(() => {
      fireData.ref('todos').once('value', function(snapshot) {
        res.send({
          success: true,
          result: snapshot.val(),
          msg: '刪除成功'
        })
      })
    })
})

// 監聽 port
var port = process.env.PORT || 3000
app.listen(port)