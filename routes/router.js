const express = require('express')
const words = require('../modules/words')

const router = express.Router()

router.get(`/`, (req, res) => {
  res.status(200).send({
    status: 'running'
  })
})

router.get(`/words`, words.getAllWords)

module.exports = router
