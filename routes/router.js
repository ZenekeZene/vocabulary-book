const express = require('express')
const words = require('../modules/words')
const autocomplete = require('../services/autocomplete/autocomplete.service')

const router = express.Router()

router.get(`/`, (req, res) => {
  res.status(200).send({
    status: 'running'
  })
})

router.get(`/words`, words.getAllWords)
router.get(`/words/:id`, words.getWord)
router.get(`/autocomplete`, autocomplete.updateWordLinks)

module.exports = router
