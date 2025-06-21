import { blogApi } from './api/blogApi'
import { toast } from './utils/toast'
import * as yup from 'yup'

const formEl = document.getElementById('postFormId')

const blogSchema = yup.object({
    title: yup.string().required('Title is required'),
    author: yup.string().required('Author is required'),
    description: yup.string(),
})

const getFormValues = () => {
    return {
        title: formEl.querySelector('[name="title"]').value.trim(),
        author: formEl.querySelector('[name="author"]').value.trim(),
        description: formEl.querySelector('[name="description"]').value.trim(),
    }
}

const validateForm = async () => {
    const values = getFormValues()

    // Clear all previous error messages
    formEl.querySelectorAll('.is-invalid').forEach((el) => {
        el.classList.remove('is-invalid')
    })

    try {
        await blogSchema.validate(values, { abortEarly: false })
        return { isValid: true, values }
    } catch (err) {
        if (err.inner) {
            err.inner.forEach((e) => {
                const fieldEl = formEl.querySelector(`[name="${e.path}"]`)
                if (fieldEl) {
                    fieldEl.classList.add('is-invalid')
                    const feedbackEl = fieldEl.parentElement.querySelector('.invalid-feedback')
                    if (feedbackEl) feedbackEl.textContent = e.message
                }
            })
        }
        return { isValid: false }
    }
}

const handleAdd = async (e) => {
    e.preventDefault()
    const result = await validateForm()
    if (!result.isValid) return

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
    const result = await validateForm()
    if (!result.isValid) return

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
        if (inputEl && inputEl.type !== 'file') {
            inputEl.value = value
        }
    }
}

;(() => {
    if (!formEl) return

    // Remove error class when user types again
    formEl.querySelectorAll('input, textarea').forEach((inputEl) => {
        inputEl.addEventListener('input', () => {
            inputEl.classList.remove('is-invalid')
        })
    })

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
