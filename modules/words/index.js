const debug = require('debug')('vocabulary-book-database:server')
const { Client } = require('@notionhq/client')
const { mapWord } = require('./map.word')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const ERROR_OBJECT_NOT_FOUND = 'object_not_found'

function parseWords (words) {
  const parsedWords = []
  words.forEach((word) => {
    const parsedWord = mapWord(word)
    if (!parsedWord) return
    parsedWords.push(parsedWord)
  })
  return parsedWords
}

async function queryAllWords (databaseId) {
  try {
    const response = await notion.databases.query({ database_id: databaseId })
    const { code, results } = response
    if (code === ERROR_OBJECT_NOT_FOUND) throw response
    return results
  } catch (error) {
    throw error
  }
}

async function getAllWords (req, res) {
  res.setHeader('Content-Type', 'application/json')
  queryAllWords(databaseId)
  .then((words) => {
    const parsedWords = parseWords(words)
    res.status(200).send({ data: parsedWords })
  }).catch((error) => {
    const { code, name, message } = error
    res.status(404).send({ error: {
      code, name, message
    }})
  })
}

module.exports = {
  getAllWords
}
