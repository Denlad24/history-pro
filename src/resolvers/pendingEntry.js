import {
    loadPendingEntry,
    savePendingEntryToStorage,
    clearPendingEntryFromStorage
} from '../services/storageService';
import { fetchPageVersion } from '../services/confluenceApi';
import { saveEntry } from './entries';

export async function savePendingEntry(req) {
    const { contentId, changelog, task } = req.payload;

    try {
        const pendingEntry = {
            changelog,
            task,
            createdAt: Date.now()
        };

        await savePendingEntryToStorage(contentId, pendingEntry);

        return { success: true, pendingEntry };
    } catch (error) {
        console.error('Error saving pending entry:', error);
        return { success: false, error: error.message };
    }
}

export async function getPendingEntry(req) {
    const { contentId } = req.payload;

    try {
        const pendingEntry = await loadPendingEntry(contentId);
        return { success: true, pendingEntry };
    } catch (error) {
        console.error('Error getting pending entry:', error);
        return { success: false, error: error.message };
    }
}

export async function finalizePendingEntry(req) {
    const { contentId } = req.payload;

    try {
        // Get pending entry
        const pendingEntry = await loadPendingEntry(contentId);

        if (!pendingEntry) {
            return { success: false, error: 'No pending entry found' };
        }

        // Get current page version
        const versionData = await fetchPageVersion(contentId);

        // Create final entry
        const finalEntry = {
            version: versionData.version.number,
            author: versionData.version.by.displayName,
            changelog: pendingEntry.changelog,
            task: pendingEntry.task,
            date: new Date(versionData.version.when).toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Save entry
        const result = await saveEntry({
            payload: { contentId, entry: finalEntry }
        });

        if (result.success) {
            // Clear pending entry
            await clearPendingEntryFromStorage(contentId);
        }

        return result;
    } catch (error) {
        console.error('Error finalizing pending entry:', error);
        return { success: false, error: error.message };
    }
}

export async function clearPendingEntry(req) {
    const { contentId } = req.payload;

    try {
        await clearPendingEntryFromStorage(contentId);
        return { success: true };
    } catch (error) {
        console.error('Error clearing pending entry:', error);
        return { success: false, error: error.message };
    }
}