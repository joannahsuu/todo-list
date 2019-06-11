var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
require('dotenv').config()

// firebase
var admin = require("firebase-admin")
const serviceAccount = {
  type: 'service_account',
  project_id: 'testproject-a9962',
  private_key_id: process.env.pkId,
  private_key: `${process.env.psText}\n${process.env.p1}\n${process.env.p2}\n${process.env.p3}\n${process.env.p4}\n${process.env.p5}\n${process.env.p6}\n${process.env.p7}\n${process.env.p8}\n${process.env.p9}\n${process.env.p10}\n${process.env.p11}\n${process.env.p12}\n${process.env.p13}\n${process.env.p14}\n${process.env.p15}\n${process.env.p16}\n${process.env.p17}\n${process.env.p18}\n${process.env.p19}\n${process.env.p20}\n${process.env.p21}\n${process.env.p22}\n${process.env.p23}\n${process.env.p24}\n${process.env.p25}\n${process.env.p26}\n${process.env.peText}\n`,
  client_email: 'firebase-adminsdk-jlp61@testproject-a9962.iam.gserviceaccount.com',
  client_id: '108757293557013637305',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jlp61%40testproject-a9962.iam.gserviceaccount.com'
}

console.log('hi')

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