function parseExamplesOfUse (examplesOfUse) {
  if (!examplesOfUse) return null
  return examplesOfUse.replace(/\n/g,'').split('- ').slice(1)
}

exports.parseExamplesOfUse = parseExamplesOfUse
