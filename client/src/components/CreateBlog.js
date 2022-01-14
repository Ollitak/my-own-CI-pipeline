import React, { useState } from 'react'

const CreateBlog = ({ addingBlog }) => {

  const [title, setTitle] = useState([])
  const [author, setAuthor] = useState([])
  const [url, setUrl] = useState([])

  const handleAddingBlog = (event) => {
    event.preventDefault()
    console.log('trying to add blog', title, author, ' ...')
    addingBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <div>
        <h2> create new blog</h2>
        <form onSubmit={handleAddingBlog}>
          title:
          <input id="titleInput" type="text" value={title} onChange={e => setTitle(e.target.value)}></input>
          <br/>
          author:
          <input id="authorInput" type="text" value={author} onChange={e => setAuthor(e.target.value)}></input>
          <br/>
          url:
          <input id="urlInput" type="text" value={url} onChange={e => setUrl(e.target.value)}></input>
          <br/>
          <button id="createButton" type="submit">create</button>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog

