const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')

const config = require('./config/key')

const { User } = require('./models/User')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// 기본 route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//회원가입 route
app.post('/register', (req, res) => {
  // 회원가입할 때 필요한 정보를 client에서 가져옴
  const user = new User(req.body)
  // 가져온 정보를 데이터베이스에 저장
  user.save((err, userInfo) => {
    if (err) return res.json({ success: fasle, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})