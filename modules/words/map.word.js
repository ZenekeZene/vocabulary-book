const { parseExamplesOfUse } = require('./parse.examples.word')

function mapWord ({ properties }) {
  const {
    Name, Meaning, Pronunciation, Dictionary,
    ['Example of use']: ExamplesOfUse
  } = properties
  const meaning = Meaning.rich_text[0]?.plain_text
  if (!meaning) return null
  const name = Name.title[0].text.content
  const examplesOfUse = ExamplesOfUse.rich_text[0]?.plain_text
  const parsedWord = {
    name,
    meaning,
    examplesOfUse: parseExamplesOfUse(examplesOfUse),
    dictionary: { url: Pronunciation.url },
    pronunciation: { url: Dictionary.url },
  }
  return parsedWord
}

exports.mapWord = mapWord
