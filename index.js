const debug = require('debug')('vocabulary-book-database:server')
const dotenv = require('dotenv')
const express = require('express')
dotenv.config()
const routes = require('./routes/router')

const port = process.env.PORT
const prefix = process.env.PREFIX
const version = process.env.VERSION
const environment = process.env.NODE_ENV

const app = express()
app.use(`/${prefix}/${version}`, routes)

const JSON_SPACES = environment === 'production' ? 0 : 2
app.set('json spaces', JSON_SPACES)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
