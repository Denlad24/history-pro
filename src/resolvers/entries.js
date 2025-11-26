import {
    loadEntries,
    saveEntriesToStorage,
    deleteEntryFromStorage
} from '../services/storageService';

export async function getEntries(req) {
    const { contentId } = req.payload;

    try {
        const entries = await loadEntries(contentId);
        return { success: true, entries };
    } catch (error) {
        console.error('Error getting entries:', error);
        return { success: false, error: error.message };
    }
}

export async function saveEntry(req) {
    const { contentId, entry } = req.payload;

    try {
        let entries = await loadEntries(contentId);

        // Add new entry
        entries.push({
            version: entry.version,
            author: entry.author,
            changelog: entry.changelog,
            task: entry.task,
            date: entry.date,
            timestamp: Date.now()
        });

        // Sort by version
        entries.sort((a, b) => a.version - b.version);

        await saveEntriesToStorage(contentId, entries);

        return { success: true, entries };
    } catch (error) {
        console.error('Error saving entry:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteEntry(req) {
    const { contentId, index } = req.payload;

    try {
        const entries = await deleteEntryFromStorage(contentId, index);
        return { success: true, entries };
    } catch (error) {
        console.error('Error deleting entry:', error);
        return { success: false, error: error.message };
    }
}