import React, { useEffect } from 'react';
import { Fragment, useProductContext, SectionMessage } from '@forge/react';
import Toolbar from './Toolbar';  // ✅ Правильно
import VersionTable from './VersionTable';  // ✅ Правильно
import PendingEntryForm from './PendingEntryForm';  // ✅ Правильно
import { useEntries } from '../hooks/useEntries';  // ✅ Правильно
import { usePageVersion } from '../hooks/usePageVersion';  // ✅ Правильно
import { usePendingEntry } from '../hooks/usePendingEntry';  // ✅ Правильно

const HistoryProMacro = () => {
    const context = useProductContext();
    const contentId = context?.extension?.content?.id;

    const {
        entries,
        loading: entriesLoading,
        refreshEntries,
        deleteEntry: handleDeleteEntry
    } = useEntries(contentId);

    const {
        currentVersion,
        previousVersion,
        refreshVersion
    } = usePageVersion(contentId, entries);

    const {
        pendingEntry,
        hasPendingEntry,
        savePending,
        clearPending,
        checkAndFinalize
    } = usePendingEntry(contentId);

    useEffect(() => {
        if (contentId && currentVersion && previousVersion) {
            if (currentVersion > previousVersion) {
                checkAndFinalize().then((finalized) => {
                    if (finalized) {
                        refreshEntries();
                        refreshVersion();
                    }
                });
            }
        }
    }, [currentVersion, previousVersion, contentId]);

    const handleRefresh = () => {
        refreshEntries();
        refreshVersion();
    };

    if (entriesLoading) {
        return <Fragment>Loading version history...</Fragment>;
    }

    return (
        <Fragment>
            <Toolbar
                onRefresh={handleRefresh}
                currentVersion={currentVersion}
            />

            {hasPendingEntry && (
                <SectionMessage appearance="information">
                    You have unsaved changes prepared. Save the page to add them to history.
                </SectionMessage>
            )}

            <PendingEntryForm
                contentId={contentId}
                pendingEntry={pendingEntry}
                onSave={savePending}
                onClear={clearPending}
                hasPendingEntry={hasPendingEntry}
            />

            <VersionTable
                entries={entries}
                contentId={contentId}
                onDeleteEntry={handleDeleteEntry}
            />
        </Fragment>
    );
};

export default HistoryProMacro;
