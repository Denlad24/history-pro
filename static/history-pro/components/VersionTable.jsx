import React from 'react';
import { Table, Button, Text, Heading } from '@forge/react';

const VersionTable = ({ entries, contentId, onDeleteEntry }) => {
    const openComparisonView = (version, prevVersion) => {
        const compareUrl = `/wiki/pages/diffpagesbyversion.action?pageId=${contentId}&selectedPageVersions=${prevVersion}&selectedPageVersions=${version}`;
        window.open(compareUrl, '_blank');
    };

    if (entries.length === 0) {
        return (
            <>
                <Heading size="medium">Version History</Heading>
                <Text>No version entries yet. Fill in the form above before making changes to the page.</Text>
            </>
        );
    }

    const reversedEntries = [...entries].reverse();

    const head = {
        cells: [
            { key: 'version', content: 'Version', width: 10 },
            { key: 'author', content: 'Author', width: 15 },
            { key: 'changelog', content: 'Change Log', width: 35 },
            { key: 'task', content: 'Task/Ticket', width: 15 },
            { key: 'date', content: 'Date', width: 15 },
            { key: 'actions', content: 'Actions', width: 10 }
        ]
    };

    const rows = reversedEntries.map((entry, index) => {
        const reversedIndex = entries.length - 1 - index;
        const prevVersion = reversedIndex > 0 ? entries[reversedIndex - 1].version : 1;

        return {
            key: `row-${index}`,
            cells: [
                {
                    key: 'version',
                    content: (
                        <Button
                            appearance="link"
                            onClick={() => openComparisonView(entry.version, prevVersion)}
                        >
                            v{entry.version}
                        </Button>
                    )
                },
                { key: 'author', content: entry.author },
                { key: 'changelog', content: entry.changelog },
                { key: 'task', content: entry.task || '-' },
                { key: 'date', content: entry.date },
                {
                    key: 'actions',
                    content: (
                        <Button appearance="subtle" onClick={() => onDeleteEntry(reversedIndex)}>
                            Delete
                        </Button>
                    )
                }
            ]
        };
    });

    return (
        <>
            <Heading size="medium">Version History</Heading>
            <Table head={head} rows={rows} />
        </>
    );
};

export default VersionTable;