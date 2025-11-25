import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();

const historyProResolver = new Resolver();

// Main handler
export async function historyProHandler(event, context) {
    const { contentId } = event.context.extension;
    const config = event.payload?.config || {};

    return {
        contentId,
        config
    };
}

// Resolver for macro config
export async function historyProResolver(event, context) {
    return historyProResolver.handle(event);
}

historyProResolver.define('main', async (req) => {
    const { contentId } = req.context.extension;
    return { contentId };
});

// Get page version
export async function getPageVersion(event, context) {
    const { contentId } = event.payload;

    try {
        const response = await api.asApp().requestConfluence(
            route`/wiki/rest/api/content/${contentId}?expand=version,history.lastUpdated`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch page version: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            version: data.version.number,
            author: data.version.by.displayName,
            date: data.version.when
        };
    } catch (error) {
        console.error('Error fetching page version:', error);
        return { success: false, error: error.message };
    }
}

// Get entries
export async function getEntries(event, context) {
    const { contentId } = event.payload;
    const storageKey = `historyPro_${contentId}`;

    try {
        const entries = await storage.get(storageKey) || [];
        return { success: true, entries };
    } catch (error) {
        console.error('Error getting entries:', error);
        return { success: false, error: error.message };
    }
}

// Save entry
export async function saveEntry(event, context) {
    const { contentId, entry } = event.payload;
    const storageKey = `historyPro_${contentId}`;

    try {
        let entries = await storage.get(storageKey) || [];

        entries.push({
            version: entry.version,
            author: entry.author,
            changelog: entry.changelog,
            task: entry.task,
            date: entry.date,
            timestamp: Date.now()
        });

        entries.sort((a, b) => a.version - b.version);

        await storage.set(storageKey, entries);

        return { success: true, entries };
    } catch (error) {
        console.error('Error saving entry:', error);
        return { success: false, error: error.message };
    }
}

// Delete entry
export async function deleteEntry(event, context) {
    const { contentId, index } = event.payload;
    const storageKey = `historyPro_${contentId}`;

    try {
        let entries = await storage.get(storageKey) || [];

        if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
            await storage.set(storageKey, entries);
        }

        return { success: true, entries };
    } catch (error) {
        console.error('Error deleting entry:', error);
        return { success: false, error: error.message };
    }
}

// Save pending entry
export async function savePendingEntry(event, context) {
    const { contentId, changelog, task } = event.payload;
    const storageKey = `historyPro_pending_${contentId}`;

    try {
        const pendingEntry = {
            changelog,
            task,
            createdAt: Date.now()
        };

        await storage.set(storageKey, pendingEntry);

        return { success: true, pendingEntry };
    } catch (error) {
        console.error('Error saving pending entry:', error);
        return { success: false, error: error.message };
    }
}

// Get pending entry
export async function getPendingEntry(event, context) {
    const { contentId } = event.payload;
    const storageKey = `historyPro_pending_${contentId}`;

    try {
        const pendingEntry = await storage.get(storageKey);
        return { success: true, pendingEntry };
    } catch (error) {
        console.error('Error getting pending entry:', error);
        return { success: false, error: error.message };
    }
}

// Finalize pending entry
export async function finalizePendingEntry(event, context) {
    const { contentId } = event.payload;
    const pendingStorageKey = `historyPro_pending_${contentId}`;
    const entriesStorageKey = `historyPro_${contentId}`;

    try {
        const pendingEntry = await storage.get(pendingStorageKey);

        if (!pendingEntry) {
            return { success: false, error: 'No pending entry found' };
        }

        // Get current page version
        const response = await api.asApp().requestConfluence(
            route`/wiki/rest/api/content/${contentId}?expand=version,history.lastUpdated`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch page version: ${response.status}`);
        }

        const data = await response.json();

        // Create final entry
        const finalEntry = {
            version: data.version.number,
            author: data.version.by.displayName,
            changelog: pendingEntry.changelog,
            task: pendingEntry.task,
            date: new Date(data.version.when).toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: Date.now()
        };

        // Save entry
        let entries = await storage.get(entriesStorageKey) || [];
        entries.push(finalEntry);
        entries.sort((a, b) => a.version - b.version);
        await storage.set(entriesStorageKey, entries);

        // Clear pending entry
        await storage.delete(pendingStorageKey);

        return { success: true, entries };
    } catch (error) {
        console.error('Error finalizing pending entry:', error);
        return { success: false, error: error.message };
    }
}

// Clear pending entry
export async function clearPendingEntry(event, context) {
    const { contentId } = event.payload;
    const storageKey = `historyPro_pending_${contentId}`;

    try {
        await storage.delete(storageKey);
        return { success: true };
    } catch (error) {
        console.error('Error clearing pending entry:', error);
        return { success: false, error: error.message };
    }
}