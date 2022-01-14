describe('Blog app', function() {
  beforeEach(function() {
    // Resetoidaan tietokanta
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    
    // Luodaan uusi testikäyttäjä
    const user = {
        username: 'testuser',
        password: 'topsecret'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user) 

    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('login form is shown', function() {
    cy.contains('Please, log in')
  })

  // Testataan kirjautumista kirjautumalla cypressin avulla
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
        cy.get('#username').type('testuser')
        cy.get('#password').type('topsecret')
        cy.get('#loginbutton').click()
        cy.contains('logged in succesfully')
    })

    it('fails with wrong credentials', function() {
        cy.get('#username').type('eitoimi')
        cy.get('#password').type('einiin')
        cy.get('#loginbutton').click()
        cy.contains('wrong credentials, please check your username and password')
    })
  })

  describe('When logged in',function() {
    // Kirjaudutaan tekemällä POST-pyyntö suoraan palvelimelle
    beforeEach(function() {
        cy.login({
          username: 'testuser',
          password: 'topsecret'
        })
      })

      // Testataan blogin tekemistä cypressin avulla
      it('A blog can be created', function() {
        cy.contains('create a new blog').click()

        cy.get('#titleInput').type('test_title')
        cy.get('#authorInput').type('test_author')
        cy.get('#urlInput').type('test_url')
        cy.get('#createButton').click()

        cy.contains('test_title')
      })

      it('A blog can be liked', function() {
        // Luodaan blogi tekemällä POST-pyyntö suoraan palvelimelle
        cy.createBlog({ title:'test_title', author: 'test_author', url: 'test_url'})

        cy.contains('view').click()
        cy.contains('like').click()

        cy.contains('Likes: 1')
      })

      it('A blog can be deleted', function() {
        // Luodaan blogi tekemällä POST-pyyntö suoraan palvelimelle
        cy.createBlog({ title:'test_title', author: 'test_author', url: 'test_url'})

        cy.contains('view').click()
        cy.contains('remove').click()

        cy.contains('blog succesfully removed')
      })

      it('blogs are ordered based on likes', function() {
        // Luodaan 2 blogia tekemällä POST-pyyntö suoraan palvelimelle
        cy.createBlog({ title:'test_title1', author: 'test_author1', url: 'test_url1'})
        cy.createBlog({ title:'test_title2', author: 'test_author2', url: 'test_url2'})

        // Painetaan molempien view-nappia
        cy.contains('test_title1').contains('view').click()
        cy.contains('test_title2').contains('view').click()

        // Ensin liketään ensimmäistä, jonka jälkeen kolmesti toista
        // --> toisen pitäisi siirtyä ensimmäiseksi
        const waitTime = 200;
        cy.wait(waitTime)
        cy.contains('test_author1').contains('like').click()

        cy.wait(waitTime)
        cy.contains('test_author2').contains('like').click()

        cy.wait(waitTime)
        cy.contains('test_author2').contains('like').click()

        cy.wait(waitTime)
        cy.contains('test_author2').contains('like').click()
        
        // Etsitään blogit classNamen perusteella,
        // wraptaan cy-elementeiksi ja varmistetaan,
        // että ensimmäinen elementti on Likes: 3 ja
        // toien Likes: 1 --> suuruusjärjestys ok
        cy.wait(waitTime)
        cy.get('.blog').then((blogs) => {
            cy.wrap(blogs[0]).contains('Likes: 3')
            cy.wrap(blogs[1]).contains('Likes: 1')
        })    
      })
  })
})
