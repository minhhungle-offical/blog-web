import dayjs from 'dayjs'
import { blogApi } from './api/blogApi'
import { truncateTextLength } from './utils/common'

const blogListEl = document.getElementById('postsListId')
const templateEl = document.getElementById('postItemTemplateId')
const paginationEl = document.getElementById('pagination')
const searchInput = document.getElementById('searchInput')

let currentPage = 1
let totalPages = 1
const limit = 6

// Update URL without reload
const updateQueryParams = (params) => {
    const url = new URL(window.location)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            url.searchParams.set(key, value)
        } else {
            url.searchParams.delete(key)
        }
    })
    window.history.pushState({}, '', url)
}

// Handle delete
const handleRemove = async (id) => {
    const confirmed = window.confirm('❗Are you sure you want to delete this post?')
    if (!confirmed) return

    try {
        await blogApi.remove(id)
        await fetchAndRenderBlogs()
    } catch (error) {
        console.error(error)
    }
}

// Render blog items
const renderBlogs = (blogList) => {
    blogListEl.innerHTML = ''
    blogList.forEach((blog) => {
        const fragmentEl = templateEl.content.cloneNode(true)
        const liEl = fragmentEl.querySelector('li')

        if (!liEl) return

        liEl.querySelector('[data-id="thumbnail"]').src = blog.image
        liEl.querySelector('[data-id="title"]').textContent = blog.title
        liEl.querySelector('[data-id="description"]').textContent = truncateTextLength(
            blog.description,
            100
        )
        liEl.querySelector('[data-id="author"]').textContent = blog.author
        liEl.querySelector('[data-id="timeSpan"]').textContent = dayjs(blog.created_at).format(
            'DD/MM/YYYY'
        )
        liEl.querySelector('[data-id="edit"]').addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            window.location.href = `/add-edit-post.html?id=${blog.id}`
        })

        liEl.querySelector('[data-id="remove"]').addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            handleRemove(blog.id)
        })

        liEl.dataset.id = blog.id

        liEl.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id
            window.location.href = `/post-detail.html?id=${id}`
        })
        blogListEl.appendChild(liEl)
    })
}

// Render pagination
const renderPagination = () => {
    paginationEl.innerHTML = ''

    const createPageItem = (page, text = page, active = false) => {
        const li = document.createElement('li')
        li.className = `page-item ${active ? 'active' : ''}`
        li.innerHTML = `<a class="page-link" href="#">${text}</a>`
        li.addEventListener('click', (e) => {
            e.preventDefault()
            currentPage = page
            updateQueryParams({ page: currentPage })
            fetchAndRenderBlogs()
        })
        return li
    }

    // Prev button
    paginationEl.appendChild(createPageItem(Math.max(1, currentPage - 1), '« Prev', false))

    for (let i = 1; i <= totalPages; i++) {
        paginationEl.appendChild(createPageItem(i, i, i === currentPage))
    }

    // Next button
    paginationEl.appendChild(createPageItem(Math.min(totalPages, currentPage + 1), 'Next »', false))
}

// Fetch and render
const fetchAndRenderBlogs = async () => {
    const title = searchInput.value
    try {
        const { data, pagination } = await blogApi.getAll({ page: currentPage, limit, title })
        totalPages = pagination.totalPages
        renderBlogs(data)
        renderPagination()
    } catch (error) {
        console.error('❌ Failed to fetch blogs:', error)
    }
}

// Handle search input
searchInput.addEventListener('input', (e) => {
    currentPage = 1
    updateQueryParams({ title: e.target.value, page: 1 })
    fetchAndRenderBlogs()
})

// On page load
;(async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const title = searchParams.get('title') || ''
    currentPage = parseInt(searchParams.get('page')) || 1
    searchInput.value = title
    await fetchAndRenderBlogs()
})()
