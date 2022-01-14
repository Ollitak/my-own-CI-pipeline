import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlog from './CreateBlog'
import { act } from 'react-dom/test-utils'



test('5.16', () => {
  const addingBlog = jest.fn()

  const component = render(
    <CreateBlog addingBlog={addingBlog}/>
  )

  const titleInput = component.container.querySelector('#titleInput')
  const authorInput = component.container.querySelector('#authorInput')
  const urlInput = component.container.querySelector('#urlInput')
  const form = component.container.querySelector('form')

  fireEvent.change(authorInput, {
    target: { value: 'TESTAUTHOR' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'TESTURL' }
  })
  fireEvent.change(titleInput, {
    target: { value: 'TESTTITLE' }
  })

  fireEvent.submit(form)

  
  expect(addingBlog.mock.calls).toHaveLength(1)
  expect(addingBlog.mock.calls[0][0].title).toBe('TESTTITLE' )
  expect(addingBlog.mock.calls[0][0].author).toBe('TESTAUTHOR' )
  expect(addingBlog.mock.calls[0][0].url).toBe('TESTURL' )
})

