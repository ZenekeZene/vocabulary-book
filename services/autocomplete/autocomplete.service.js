const { Client } = require('@notionhq/client')
const _ = require("lodash")
const { parseWords, queryAllWords } = require('../../modules/words')

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const OPERATION_BATCH_SIZE = 50

async function autoCompleteWordProperties ({ words }) {
  const wordsToUpdateChunks = _.chunk(words, OPERATION_BATCH_SIZE)
  for (const wordsToUpdateBatch of wordsToUpdateChunks) {
    await Promise.all(
      wordsToUpdateBatch.map(async (wordToUpdate) => {
        const { id, name } = wordToUpdate
        const parsedName = name.replace(/\+/g, "").trimEnd()
        const parsed2Name = parsedName.replace(/\s+/g, '+')
        const dictionaryURL = `https://www.linguee.es/search?source=auto&query=${parsed2Name}`
        const pronunciationURL = `https://playphrase.me/#/search?q=${parsed2Name}`
        await notion.pages.update({
          page_id: id,
          properties: {
            'Dictionary': { url: dictionaryURL },
            'Pronunciation': { url: pronunciationURL }
          }
        })
      })
    )
  }
  return { count: words.length }
}

async function updateWordLinks (req, res) {
  queryAllWords({ databaseId })
  .then(async (words) => {
    const parsedWords = parseWords({ words })
    const success = await autoCompleteWordProperties({ words: parsedWords })
    res.status(200).send({ data: `${success.count} were updated successfully` })
  }).catch((error) => {
    const { code, name, message } = error
    res.status(404).send({ error: {
      code, name, message
    }})
  })
}

exports.updateWordLinks = updateWordLinks
