import { blogApi } from './api/blogApi'
import { toast } from './utils/toast'

const formEl = document.getElementById('postFormId')

const handleAdd = async (e) => {
    e.preventDefault()
    const formData = new FormData(formEl)

    try {
        const res = await blogApi.add(formData)
        toast.success('Add blog successfully!')
        window.location.href = `/post-detail.html?id=${res.id}`
    } catch (error) {
        console.error('Add blog failed: ', error)
    }
}

const handleEdit = async (e, id) => {
    e.preventDefault()
    const formData = new FormData(formEl)

    try {
        await blogApi.update(id, formData)
        toast.success('Update blog successfully!')
        window.location.href = `/post-detail.html?id=${id}`
    } catch (error) {
        console.error('Edit blog failed: ', error)
    }
}

const prefillForm = (data) => {
    const authorInputEl = formEl.querySelector(`[name="author"]`)
    if (authorInputEl) authorInputEl.value = data.author
    for (let [key, value] of Object.entries(data)) {
        const inputEl = formEl.querySelector(`[name="${key}"]`)
        if (inputEl) inputEl.value = value
    }
}

// MAIN
;(() => {
    if (!formEl) return

    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get('id')

    if (id) {
        blogApi
            .getById(id)
            .then((blog) => {
                prefillForm(blog)
            })
            .catch((error) => {
                console.error('Fetch blog to edit failed: ', error)
            })

        formEl.addEventListener('submit', (e) => handleEdit(e, id))
        return
    }

    formEl.addEventListener('submit', handleAdd)
})()
