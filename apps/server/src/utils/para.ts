const string = `Hello, this is a paragraph, it is a string of text that is longer than a sentence. It is used to test the game. You are seeing this because we can't fetch the paragraph from the server. This paragraph is two sentences long and has 200 words. This is the end of the paragraph.`

function getParagraphFromString() {
  const words = string.split(' ')
  const paragraph = []

  for (let i = 0; i < 50; i++) {
    paragraph.push(words[Math.floor(Math.random() * words.length)])
  }

  return paragraph.join(' ').toLowerCase()
}

async function getParagraph() {
  try {
    const response = await fetch('http://metaphorpsum.com/paragraphs/2/5')

    if (!response.ok) {
      throw new Error('Failed to fetch paragraph')
    }

    const data = await response.text()
    return data.split('\n').join(' ')
  } catch (error) {
    console.error(error)
    return getParagraphFromString()
  }
}

export default getParagraph
