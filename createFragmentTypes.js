const got = require('got')
const fs = require('fs')

got(`http://localhost:4000`, {
  method: 'POST',
  json: true,
  body: {
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  },
}).then(result => {
  const data = result.body.data

  // here we're filtering out any type information unrelated to unions or interfaces
  const filteredData = data.__schema.types.filter(
    type => type.possibleTypes !== null,
  )

  data.__schema.types = filteredData

  fs.writeFile('./fragmentTypes.json', JSON.stringify(data), err => {
    if (err) {
      console.error('Error writing fragmentTypes file', err)
    } else {
      console.log('Fragment types successfully extracted!')
    }
  })
})
