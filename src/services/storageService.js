import { storage } from '@forge/api';

const STORAGE_PREFIX = 'historyPro_';
const PENDING_PREFIX = 'historyPro_pending_';

function getStorageKey(contentId) {
    return `${STORAGE_PREFIX}${contentId}`;
}

function getPendingStorageKey(contentId) {
    return `${PENDING_PREFIX}${contentId}`;
}

// Entries management
export async function loadEntries(contentId) {
    const storageKey = getStorageKey(contentId);
    const entries = await storage.get(storageKey);
    return entries || [];
}

export async function saveEntriesToStorage(contentId, entries) {
    const storageKey = getStorageKey(contentId);
    await storage.set(storageKey, entries);
    return entries;
}

export async function deleteEntryFromStorage(contentId, index) {
    const entries = await loadEntries(contentId);

    if (index >= 0 && index < entries.length) {
        entries.splice(index, 1);
        await saveEntriesToStorage(contentId, entries);
    }

    return entries;
}

export async function clearAllEntries(contentId) {
    const storageKey = getStorageKey(contentId);
    await storage.delete(storageKey);
}

// Pending entry management
export async function loadPendingEntry(contentId) {
    const storageKey = getPendingStorageKey(contentId);
    return await storage.get(storageKey);
}

export async function savePendingEntryToStorage(contentId, pendingEntry) {
    const storageKey = getPendingStorageKey(contentId);
    await storage.set(storageKey, pendingEntry);
    return pendingEntry;
}

export async function clearPendingEntryFromStorage(contentId) {
    const storageKey = getPendingStorageKey(contentId);
    await storage.delete(storageKey);
}