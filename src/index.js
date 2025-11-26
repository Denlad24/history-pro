import Resolver from '@forge/resolver';
import { getPageVersion } from './resolvers/pageVersion';
import { saveEntry, deleteEntry, getEntries } from './resolvers/entries';
import {
    savePendingEntry,
    getPendingEntry,
    finalizePendingEntry,
    clearPendingEntry
} from './resolvers/pendingEntry';
import { getConfig } from './resolvers/config';

const resolver = new Resolver();

// Main macro renderer
resolver.define('main', async (req) => {
    const { contentId } = req.context.extension;
    const config = req.payload.config || {};

    return {
        contentId,
        config
    };
});

// Config resolver
resolver.define('resolver', async (req) => {
    return getConfig(req);
});

// Page version resolver
resolver.define('getPageVersion', async (req) => {
    return getPageVersion(req);
});

// Entry management resolvers
resolver.define('saveEntry', async (req) => {
    return saveEntry(req);
});

resolver.define('deleteEntry', async (req) => {
    return deleteEntry(req);
});

resolver.define('getEntries', async (req) => {
    return getEntries(req);
});

// Pending entry resolvers
resolver.define('savePendingEntry', async (req) => {
    return savePendingEntry(req);
});

resolver.define('getPendingEntry', async (req) => {
    return getPendingEntry(req);
});

resolver.define('finalizePendingEntry', async (req) => {
    return finalizePendingEntry(req);
});

resolver.define('clearPendingEntry', async (req) => {
    return clearPendingEntry(req);
});

export const handler = resolver.getDefinitions();

export async function run(event, context) {
    return resolver.handle(event);
}