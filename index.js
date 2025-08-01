const fs = require('fs') 
const csvReader = require('fast-csv')
const StoryblokClient = require('storyblok-js-client')

// Initialize the client with the oauth token
const Storyblok = new StoryblokClient({
  oauthToken: 'hd62C3Ra9hDR95IJS9vv2Qtt-206715-o8y4xz4DrNksn1B2c228' // can be found in your My account section
})

const config = {
  spaceId: '243306', // can be found in the space settings.
  parentFolder: '74141631326692' // navigate into your folder and copy the id from the URL at app.storyblok.com <- last one 
}

let stream = fs.createReadStream('demo.csv')

const formatSlug = (slug) => {
  return slug.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
}

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

csvReader.parseStream(stream, { headers: true, delimiter: ';' })
  .on('data', (line) => {
    // one line of csv in here
    let story = {
      slug: formatSlug(line.artist1),
      name: removeAccents(line.artist1),
      parent_id: config.parentFolder,
      content: {
        component: 'concert',
        entrades: line.entrades,
        artist1: line.artist1,
        artist2: line.artist2,
        artist3: line.artist3,
        data: line.data + ' ' + line.hora,
        sala: line.sala,
        localitat: line.localitat,
        circuit: line.circuit,
      }
    }

    Storyblok.post(`spaces/${config.spaceId}/stories/`, {
      story
    }).then(res => {
      console.log(`Success: ${res.data.story.name} was created.`)
    }).catch(err => {
      console.log(`Error: ${err}`)
    })
  })
  /* .on('end', () => {
    // Done reading the CSV - now we finally create the component with a definition for each field
    // we can also skip that and define the content type using the interface at app.storyblok.com
    let component = {
      name: "post",
      display_name: "Post",
      schema: {
        title: {
          type: "text",
          pos: 0
        },
        text: {
          type: "markdown",
          pos: 1
        },
        image: {
          type: "image",
          pos: 2
        },
        category: {
          type: "text",
          pos: 3
        }
      },
      is_root: true, // is content type
      is_nestable: false // is nestable (in another content type)
    } 

    Storyblok.post(`spaces/${config.spaceId}/components/`, {
      component
    }).then(res => {
      console.log(`Success: ${res.data.component.name} was created.`)
    }).catch(err => {
      console.log(`Error: ${err}`)
    })
  })*/

