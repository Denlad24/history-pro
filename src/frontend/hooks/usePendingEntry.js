import { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

export function usePendingEntry(contentId) {
    const [pendingEntry, setPendingEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadPendingEntry = async () => {
        if (!contentId) return;

        try {
            setLoading(true);
            const result = await invoke('getPendingEntry', { contentId });

            if (result.success && result.pendingEntry) {
                setPendingEntry(result.pendingEntry);
            } else {
                setPendingEntry(null);
            }
        } catch (error) {
            console.error('Error loading pending entry:', error);
            setPendingEntry(null);
        } finally {
            setLoading(false);
        }
    };

    const savePending = async (changelog, task) => {
        try {
            const result = await invoke('savePendingEntry', {
                contentId,
                changelog,
                task
            });

            if (result.success) {
                setPendingEntry(result.pendingEntry);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving pending entry:', error);
            return false;
        }
    };

    const finalizePending = async () => {
        try {
            const result = await invoke('finalizePendingEntry', { contentId });

            if (result.success) {
                setPendingEntry(null);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error finalizing pending entry:', error);
            return false;
        }
    };

    const clearPending = async () => {
        try {
            const result = await invoke('clearPendingEntry', { contentId });

            if (result.success) {
                setPendingEntry(null);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error clearing pending entry:', error);
            return false;
        }
    };

    const checkAndFinalize = async () => {
        if (pendingEntry) {
            return await finalizePending();
        }
        return false;
    };

    useEffect(() => {
        loadPendingEntry();
    }, [contentId]);

    return {
        pendingEntry,
        hasPendingEntry: !!pendingEntry,
        loading,
        savePending,
        finalizePending,
        clearPending,
        checkAndFinalize
    };
}