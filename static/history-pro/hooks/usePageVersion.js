import { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

export function usePageVersion(contentId, entries) {
    const [currentVersion, setCurrentVersion] = useState(null);
    const [previousVersion, setPreviousVersion] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadPageVersion = async () => {
        if (!contentId) return;

        try {
            setLoading(true);
            const result = await invoke('getPageVersion', { contentId });

            if (result.success) {
                setPreviousVersion(currentVersion);
                setCurrentVersion(result.version);
            }
        } catch (error) {
            console.error('Error getting page version:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshVersion = () => {
        loadPageVersion();
    };

    useEffect(() => {
        loadPageVersion();
    }, [contentId]);

    useEffect(() => {
        if (entries && entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.version) {
                setPreviousVersion(lastEntry.version);
            }
        }
    }, [entries]);

    return {
        currentVersion,
        previousVersion,
        loading,
        refreshVersion
    };
}