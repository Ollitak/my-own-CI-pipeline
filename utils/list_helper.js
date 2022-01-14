dummy = (blogs) => {
    return 1
}

totalLikes = (blogs) => {
    likes = blogs.map(blog => blog.likes)
    return likes.reduce((acc, a) => acc + a, 0)
}

favoriteBlog = (blogs) => {
    return blogs.filter(b => b.likes === Math.max(...blogs.map(b=>b.likes)))[0]
}

mostBlogs = (blogs) => {
    // a on olio, joka sisältää kaikki kirjoittajat avaimina
    // ja kirjoitettujen blogien määrän avaimien arvoina
    const a = {}
    blogs.forEach(b => a[b.author] = (a[b.author] || 0 ) + 1)

    // Etsitään olion arvoista maksimi, minkä jälkeen etsitään
    // kirjoittajan nimi ja luodaan vastaava olio
    const max = Math.max(...Object.values(a))
    const author = Object.keys(a).find(k => a[k] === max)
    return {
        author: author,
        blogs: max
    }
}

mostLikes = (blogs) => {
    const a = {}
    blogs.forEach(b => a[b.author] = (a[b.author] || 0 ) + b.likes)

    const max = Math.max(...Object.values(a))
    const author = Object.keys(a).find(k => a[k] === max)
    return {
        author: author,
        likes: max
    }
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}