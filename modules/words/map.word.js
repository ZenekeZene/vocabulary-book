const { parseExamplesOfUse } = require('./parse.examples.word')

function mapWord (word) {
  const id = word.id
  const {
    Name, Meaning, Pronunciation, Dictionary,
    ['Example of use']: ExamplesOfUse
  } = word.properties
  const meaning = Meaning.rich_text[0]?.plain_text
  if (!meaning) return null
  const name = Name.title[0].text.content
  const examplesOfUse = ExamplesOfUse.rich_text[0]?.plain_text
  const parsedWord = {
    id,
    name,
    meaning,
    examplesOfUse: parseExamplesOfUse(examplesOfUse),
    dictionary: { url: Dictionary.url },
    pronunciation: { url: Pronunciation.url },
  }
  return parsedWord
}

exports.mapWord = mapWord
