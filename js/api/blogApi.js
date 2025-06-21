import axiosClient from './axiosClient'

const url = '/blogs'

export const blogApi = {
    getAll(params) {
        return axiosClient.get(url, { params })
    },
    getById(id) {
        return axiosClient.get(`${url}/${id}`)
    },
    add(data) {
        return axiosClient.post(url, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    update(id, body) {
        return axiosClient.put(`${url}/${id}`, body, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    remove(id) {
        return axiosClient.delete(`${url}/${id}`)
    },
}
