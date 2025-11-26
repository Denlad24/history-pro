import React from 'react';
import { Button, ButtonGroup, Text } from '@forge/react';

const Toolbar = ({ onRefresh, currentVersion }) => {
    return (
        <>
            <ButtonGroup>
                <Button appearance="subtle" onClick={onRefresh}>
                    Refresh
                </Button>
            </ButtonGroup>

            {currentVersion && (
                <Text>Current page version: <strong>v{currentVersion}</strong></Text>
            )}
        </>
    );
};

export default Toolbar;