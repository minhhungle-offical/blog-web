import { blogApi } from './api/blogApi.js'

const queryParams = new URLSearchParams(window.location.search)
const id = queryParams.get('id')

const titleEl = document.getElementById('postDetailTitle')
const authorEl = document.getElementById('postDetailAuthor')
const timeEl = document.getElementById('postDetailTimeSpan')
const descEl = document.getElementById('postDetailDescription')
const heroEl = document.getElementById('postHeroImage')

const renderPostDetail = (post) => {
    if (!post) return

    titleEl.textContent = post.title
    authorEl.textContent = post.author
    timeEl.textContent = new Date(post.updatedAt).toLocaleDateString()

    descEl.textContent = post.description

    // Set background for hero section
    heroEl.style.backgroundImage = `url("${post.image}")`
}

;(async () => {
    try {
        const blog = await blogApi.getById(id)
        renderPostDetail(blog)

        // Optional: gán link edit nếu muốn
        const editLink = document.getElementById('goToEditPageLink')
        editLink.innerHTML = `<i class="fas fa-edit me-1"></i> Edit post`
        editLink.href = `/add-edit-post.html?id=${id}`
    } catch (error) {
        console.error('Failed to fetch blog: ', error)
    }
})()
