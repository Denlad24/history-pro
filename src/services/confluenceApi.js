import api, { route } from '@forge/api';

export async function fetchPageVersion(contentId) {
    const response = await api.asApp().requestConfluence(
        route`/wiki/rest/api/content/${contentId}?expand=version,history.lastUpdated`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch page version: ${response.status}`);
    }

    return await response.json();
}

export async function fetchPageVersionDetails(contentId, versionNumber) {
    const response = await api.asApp().requestConfluence(
        route`/wiki/rest/api/content/${contentId}/version/${versionNumber}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch version details: ${response.status}`);
    }

    return await response.json();
}

export async function getCurrentUser() {
    const response = await api.asApp().requestConfluence(
        route`/wiki/rest/api/user/current`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch current user: ${response.status}`);
    }

    return await response.json();
}