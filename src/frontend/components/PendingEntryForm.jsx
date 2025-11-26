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

    // ✅ Правильный обработчик для UI Kit Form
    const handleSave = async (formData) => {
        if (!formData.changelog || !formData.changelog.trim()) {
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData.changelog.trim(), formData.task?.trim() || '');
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
                Fill in the details before saving the page. The version and author will be added automatically after save.
            </Text>

            <Form onSubmit={handleSave}>
                <FormSection>
                    <TextArea
                        name="changelog"
                        label="Change Log"
                        isRequired={true}
                        placeholder="Describe what you're about to change..."
                        description="This field is required"
                        defaultValue={formData.changelog}
                    />

                    <TextField
                        name="task"
                        label="Task/Ticket"
                        placeholder="e.g., PROJ-123"
                        description="Optional reference to your task tracker"
                        defaultValue={formData.task}
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
                            isDisabled={isSaving}
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