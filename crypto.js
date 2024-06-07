const crypto = require('crypto')

const languages = ['hi', 'kn', 'ma', 'ml', 'ta', 'te', 'pa']

const hashs = languages.map((lang) => {
      let hash = crypto.createHash('md5').update(lang).digest("hex") 
      return ({
        [`${hash}`]: 0
      })
} )

console.log(hashs)
