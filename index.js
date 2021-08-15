// Load in our dependencies
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const recaptcha = require('./recaptcha.json')
const path = require('path')

const db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.sqlite',
  },
})

const app = express()

// Configure Express
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/scan', express.static(path.join(__dirname, 'scanWebview')));

// Home Route
app.get('/', function (req, res) {
  res.status(200).send('API operational')
})

app.use('/api/protected', async (req, res, next) => {

  if (!req.body.response) return res.status(400).json({
    error: 'Captcha nicht gelöst'
  })

  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha.secret}&response=${req.body.response}`, {
    method: 'post'
  })

  const json = await response.json()

  if (!json.success) return res.status(403).json({
    error: 'Captcha nicht richtig'
  })

  next()
})

// API Routes
app.get('/api/public/test', (req, res) => {
  res.status(200).json({ success: 'Systems operational' })
})

// Other routes
require('./routes/theater')(app, db)

// Launch our app on port 3000
app.listen('3000', () => console.log('Server listening on port 3000'))
