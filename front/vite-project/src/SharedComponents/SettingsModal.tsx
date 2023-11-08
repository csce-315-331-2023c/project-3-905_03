import React, { useState } from 'react';
import { Slide, Switch, FormGroup, FormControlLabel, Button } from '@mui/material';
import './Styles/SettingsModal.css';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    onColorSchemeChange: (scheme: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onColorSchemeChange }) => {

    const [altText, setAltText] = useState<boolean>(true);

    const handleAltTextToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAltText(event.target.checked);
    };

    const handleColorSchemeChange = (newScheme: string) => {
        onColorSchemeChange(newScheme);
        onClose();
    };

    return (
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <div className="settings-panel">
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={altText} onChange={handleAltTextToggle} />}
                        label="Alternative Text for Images"
                    />
                    <div className="color-scheme-selection">
                        <Button onClick={() => handleColorSchemeChange('default')}>Default</Button>
                        <Button onClick={() => handleColorSchemeChange('dark')}>Dark</Button>
                        <Button onClick={() => handleColorSchemeChange('light')}>Light</Button>
                    </div>
                </FormGroup>
            </div>
        </Slide>
    );
};

export default SettingsModal;
