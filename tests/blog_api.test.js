const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
{
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 7
}
]

const initialUser = {
  username: "TESTIKAYTTAJA",
  password: "TESTI123"
}


beforeEach(async () => {
  // Tyhjennetään blogikokoelma ja alustetaan kahdella blogilla
  await Blog.deleteMany({})
  let firstBlog = new Blog(initialBlogs[0])
  await firstBlog.save()
  let secondBlog = new Blog(initialBlogs[1])
  await secondBlog.save()

  // Tyhjennetään käyttäjät ja luodaan uusi käyttäjä
  await User.deleteMany({})
  await api
  .post('/api/users')
  .send(initialUser)
})


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  


// Oikean palautusmäärän testaus
test('right amount of blogs in the database', async () => {
  const blogs = await api.get('/api/blogs')
  expect(blogs.body).toHaveLength(initialBlogs.length)
})



// Palautettujen blogien tunnistekenttä on "id"
test('testing for the id field to be "id"', async () => {
  const blogs = await api.get('/api/blogs')
  expect(blogs.body[0].id).toBeDefined()
})



// Blogien määrää kasvatetaan yhdellä
test('testing for increasing the amount of blogs by 1', async () => {
  const additionalBlog = 
  {
    title: 'OneAdded',
    author: 'Blaablaa',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 99
  }

  let tobeadded = new Blog(additionalBlog)
  await tobeadded.save()

  // Testataan, että määrä kasvanut yhdellä
  const blogs = await api.get('/api/blogs')
  expect(blogs.body).toHaveLength(initialBlogs.length + 1)

  // Testataan, että lisätty blogi löytyy varmasti 
  const titles = blogs.body.map(b => b.title)
  expect(titles).toContain('OneAdded')
})

// Testing for login
test('login test for test user' , async () => {
  await api
  .post('/api/login')
  .send(initialUser)
  .expect(200)
})


// Blogien lisääminen vaatii tokenin
test('testing for token requirement in post requests', async () => {
  const additionalBlog = 
  {
    title: 'OneAdded',
    author: 'Blaablaa',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 99
  }

  // Ensin ilman tokenia
  await api
  .post('/api/blogs')
  .send(additionalBlog)
  .expect(401)

  // Logataan testikäyttäjällä sisään
  const loggedin =  await api
  .post('/api/login')
  .send(initialUser)
  .expect(200)

  // Testataan tokenin kanssa
  await api
  .post('/api/blogs')
  .set('Authorization', 'bearer ' + loggedin.body.token)
  .send(additionalBlog)
  .expect(201)
})




// Jos likes-kenttää ei aseteta, niin arvoksi tulee 0
test('testing for likes to be 0 in case no likes field included', async () => {
  const additionalBlog = 
  {
    title: 'EmptyLikes',
    author: 'Blaablaa',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }

  // Logataan testikäyttäjällä sisään
  const loggedin =  await api
  .post('/api/login')
  .send(initialUser)
  .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + loggedin.body.token)
    .send(additionalBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Testataan, että lisätty blogi löytyy
  const blogs = await api.get('/api/blogs')
  const titles = blogs.body.map(b => b.title)
  expect(titles).toContain('EmptyLikes')

  // Testataan, että likes löytyy
  const addedBlog = blogs.body.filter(b => b.title === 'EmptyLikes')
  expect(addedBlog[0].likes).toBeDefined()
  // Testataan, että likes on 0
  expect(addedBlog[0].likes).toBe(0)

})



// Jos title ja url-kenttiä ei aseteta, niin palvelimen vastuas on 400
test('testing for 400 Bad Request in case empty title and url', async () => {
  const additionalBlog = 
  {
    author: 'Blaablaa',
    likes: 99
  }

  // Logataan testikäyttäjällä sisään
  const loggedin =  await api
  .post('/api/login')
  .send(initialUser)
  .expect(200)

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + loggedin.body.token)
    .send(additionalBlog)
    .expect(400)
})



afterAll(() => {
  mongoose.connection.close()
})