import React, { useState, useEffect } from 'react';
import {
    Form,
    FormSection,
    FormFooter,
    TextField,
    TextArea,
    Button,
    ButtonGroup,
    Heading,
    Text
} from '@forge/react';

const PendingEntryForm = ({
                              contentId,
                              pendingEntry,
                              onSave,
                              onClear,
                              hasPendingEntry
                          }) => {
    const [formData, setFormData] = useState({
        changelog: '',
        task: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (pendingEntry) {
            setFormData({
                changelog: pendingEntry.changelog || '',
                task: pendingEntry.task || ''
            });
        }
    }, [pendingEntry]);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.changelog.trim()) {
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData.changelog.trim(), formData.task.trim());
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = async () => {
        await onClear();
        setFormData({ changelog: '', task: '' });
    };

    return (
        <>
            <Heading size="medium">Prepare Next Version Entry</Heading>
            <Text>
                Fill in the details <strong>before</strong> saving the page.
                The version and author will be added automatically after save.
            </Text>

            <Form onSubmit={handleSave}>
                <FormSection>
                    <TextArea
                        name="changelog"
                        label="Change Log"
                        isRequired
                        placeholder="Describe what you're about to change..."
                        description="This field is required"
                        value={formData.changelog}
                        onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                    />

                    <TextField
                        name="task"
                        label="Task/Ticket"
                        placeholder="e.g., PROJ-123"
                        description="Optional reference to your task tracker"
                        value={formData.task}
                        onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    />
                </FormSection>

                <FormFooter>
                    <ButtonGroup>
                        {hasPendingEntry && (
                            <Button
                                appearance="subtle"
                                onClick={handleClear}
                                isDisabled={isSaving}
                            >
                                Clear
                            </Button>
                        )}
                        <Button
                            appearance="primary"
                            type="submit"
                            isDisabled={isSaving || !formData.changelog.trim()}
                        >
                            {isSaving ? 'Saving...' : hasPendingEntry ? 'Update Entry' : 'Prepare Entry'}
                        </Button>
                    </ButtonGroup>
                </FormFooter>
            </Form>
        </>
    );
};

export default PendingEntryForm;