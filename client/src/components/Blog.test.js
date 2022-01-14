import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

// HUOM!!!
// Tehtävänannossa ehdotetaan, että view-nappia painettaessa näytettäisiin
// blogin URL. Näytän URL:n tilalla kuitenkin authorin, joten testitkin
// testaavat URL:n sijaan authoria. Toivottavasti ei haittaa :)

test('5.13: renders the right content', () => {
  const testblog = {
    id: '1233',
    user: 'TESTIUSER',
    likes: 10,
    author: 'TESTIAUTHOR',
    title: 'TESTITITLE',
    url: 'TESTIURL'
  }

  const component = render(
    <Blog blog={testblog} />
  )

  expect(component.container).toHaveTextContent('TESTITITLE')
  expect(component.container).not.toHaveTextContent('TESTIAUTHOR')
  expect(component.container).not.toHaveTextContent('Likes: ')
})



test('5.14: if view button is pressed, blog layout expands', () => {
  const testblog = {
    id: '1233',
    user: 'TESTIUSER',
    likes: 10,
    author: 'TESTIAUTHOR',
    title: 'TESTITITLE',
    url: 'TESTIURL'
  }

  const component = render(
    <Blog blog={testblog} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent('TESTITITLE')
  expect(component.container).toHaveTextContent('TESTIAUTHOR') // testataan authoria eikä urlia
  expect(component.container).toHaveTextContent('Likes: ')
})



test('5.15: if like is pressed twice, props eventHandler is also called twice', () => {
  const testblog = {
    id: '1233',
    user: 'TESTIUSER',
    likes: 10,
    author: 'TESTIAUTHOR',
    title: 'TESTITITLE',
    url: 'TESTIURL'
  }

  const updatingBlog = jest.fn()

  const component = render(
    <Blog blog={testblog} updatingBlog={updatingBlog}/>
  )

  const button = component.getByText('view')
  fireEvent.click(button)


  const button2 = component.getByText('like')
  fireEvent.click(button2)
  fireEvent.click(button2)

  expect(updatingBlog.mock.calls).toHaveLength(2)

})

