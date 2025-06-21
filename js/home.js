import dayjs from 'dayjs'
import { blogApi } from './api/blogApi'
import { truncateTextLength } from './utils/common'

// render post list
// pagination
// filter by query page, limit, title

const blogListEl = document.getElementById('postsListId')
const templateEl = document.getElementById('postItemTemplateId')

const renderBlogs = (blogList) => {
    if (!blogListEl || !templateEl) return

    blogListEl.textContent = '' // Xoá cũ (nếu cần)

    blogList.forEach((blog) => {
        const liEl = templateEl.content.cloneNode(true) // ⬅ Di chuyển dòng này vào trong forEach

        const thumbnailEl = liEl.querySelector('[data-id="thumbnail"]')
        if (thumbnailEl) thumbnailEl.src = blog.image

        const titleEl = liEl.querySelector('[data-id="title"]')
        if (titleEl) titleEl.textContent = blog.title

        const descriptionEl = liEl.querySelector('[data-id="description"]')
        if (descriptionEl) {
            descriptionEl.textContent = truncateTextLength(blog.description, 100)
        }

        const authorEl = liEl.querySelector('[data-id="author"]')
        if (authorEl) authorEl.textContent = blog.author

        const timeSpanEl = liEl.querySelector('[data-id="timeSpan"]')
        if (timeSpanEl) {
            timeSpanEl.textContent = dayjs(blog.created_at).format('DD/MM/YYYY')
        }

        blogListEl.appendChild(liEl)
    })
}
// Main
;(async () => {
    // get query

    const searchParams = new URLSearchParams(window.location.search)

    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const title = searchParams.get('title')
    console.log('params:', page, limit, title)

    try {
        const { data, pagination } = await blogApi.getAll({ page, limit, title })

        if (Array.isArray(data) && data.length > 0) {
            console.log('data 1 :', data)
            renderBlogs(data)
        }
    } catch (error) {
        console.error('error: ', error)
    }
})()
