const debug = require('debug')('vocabulary-book-database:server')
const { Client } = require('@notionhq/client')
const { mapWord } = require('./map.word')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

function parseWords ({ words }) {
  const parsedWords = []
  words.forEach((word) => {
    const parsedWord = mapWord(word)
    if (!parsedWord) return
    parsedWords.push(parsedWord)
  })
  return parsedWords
}

async function queryAllWords ({ databaseId }) {
  const pages = []
  let cursor = undefined
  while (true) {
    const { results, next_cursor } = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    })
    pages.push(...results)
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return pages
}

async function queryWord ({ id }) {
  const response = await notion.pages.retrieve({
    page_id: id,
  })
  return response
}

async function getAllWords (req, res) {
  res.setHeader('Content-Type', 'application/json')
  queryAllWords({ databaseId })
  .then(async (words) => {
    const parsedWords = parseWords({ words })
    res.status(200).send({ data: parsedWords })
  }).catch((error) => {
    const { code, name, message } = error
    res.status(404).send({ error: {
      code, name, message
    }})
  })
}

async function getWord (req, res) {
  res.setHeader('Content-Type', 'application/json')
  const params = req.params
  queryWord({ id: params.id })
  .then(async (word) => {
    const parsedWord = parseWords({ words: [word] })
    res.status(200).send({ data: parsedWord })
  }).catch((error) => {
    const { code, name, message } = error
    res.status(404).send({ error: {
      code, name, message
    }})
  })
}

module.exports = {
  parseWords,
  queryAllWords,
  getWord,
  getAllWords
}
