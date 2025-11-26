import { fetchPageVersion } from '../services/confluenceApi';

export async function getPageVersion(req) {
    const { contentId } = req.payload;

    try {
        const versionData = await fetchPageVersion(contentId);

        return {
            success: true,
            version: versionData.version.number,
            author: versionData.version.by.displayName,
            date: versionData.version.when
        };
    } catch (error) {
        console.error('Error fetching page version:', error);
        return {
            success: false,
            error: error.message
        };
    }
}