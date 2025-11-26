import { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';

export function useEntries(contentId) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEntries = async () => {
        if (!contentId) return;

        try {
            setLoading(true);
            setError(null);
            const result = await invoke('getEntries', { contentId });

            if (result.success) {
                setEntries(result.entries);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Error loading entries:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (index) => {
        try {
            const result = await invoke('deleteEntry', { contentId, index });

            if (result.success) {
                setEntries(result.entries);
            }
        } catch (err) {
            console.error('Error deleting entry:', err);
        }
    };

    const refreshEntries = () => {
        loadEntries();
    };

    useEffect(() => {
        loadEntries();
    }, [contentId]);

    return {
        entries,
        loading,
        error,
        refreshEntries,
        deleteEntry
    };
}