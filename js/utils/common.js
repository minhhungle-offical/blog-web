export const truncateTextLength = (text, maxLength) => {
    if (typeof text !== 'string') return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

export function formatDate(date) {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
}
