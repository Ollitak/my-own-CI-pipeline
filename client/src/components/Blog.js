import React, { useState } from 'react'

const Blog = ({ blog, updatingBlog, removingBlog, user }) => {
  const [showinfo, setShowinfo] = useState([])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleViewBlog = () => {
    setShowinfo(showinfo.concat(blog.id.toString()))
  }

  const handleHideBlog = () => {
    setShowinfo(showinfo.filter(i => i.toString() !== blog.id.toString()))
  }

  const handleUpdate = async () => {
    console.log('updating blog...')
    const updatedblog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await updatingBlog(updatedblog, blog.id.toString())
  }

  const handleDelete = async () => {
    console.log('removing blog...')
    await removingBlog(blog.id.toString())
  }



  const shortinformation = () => {
    return(
      <div>
        {blog.title}
        <button onClick={handleViewBlog}> view </button>
      </div>
    )
  }

  let currentUser
  if(user) currentUser = user.username
  else currentUser = null


  const longinformation = () => {
    return(
      <div className={'blog'}>
        Title: {blog.title}
        <button onClick={handleHideBlog}> hide </button>
        <br/>
        Author: {blog.author}
        <br/>
        Likes: {blog.likes}
        <button onClick={handleUpdate}> like </button>
        <br/>
        Username: {blog.user.username}
        <br/>
        {blog.user.username === currentUser
          ? <button onClick={handleDelete}> remove </button>
          : null
        }
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {showinfo.includes(blog.id.toString()) ? longinformation() : shortinformation()}
      <br/>
    </div>
  )


}


export default Blog