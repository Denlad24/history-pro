export function formatDate(dateString) {
    return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function validateEntry(entry) {
    if (!entry.changelog || !entry.changelog.trim()) {
        return { valid: false, error: 'Change log is required' };
    }

    return { valid: true };
}