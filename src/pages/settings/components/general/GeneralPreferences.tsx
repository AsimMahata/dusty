import React, { useEffect, useState } from 'react';
import { useSettings } from '../../../../contexts/SettingsContext';
import { SETTINGS_GENERAL_ICON } from '../../../../constants/icon';
import { getGeneralPreferencesList } from '../../actions/getGeneralPreferencesList';
import { SettingItem } from './SettingItem';
import { getAvailableTerminalsIPC } from '../../../../personalities/ambiverts/terminal';
import { getValueBySessionIdIPC, addOrUpdateBySessionIdIPC } from '../../../../personalities/ambiverts/session';

export const GeneralPreferences: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [availableTerminals, setAvailableTerminals] = useState<string[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<string>('');

    useEffect(() => {
        let active = true;
        async function loadTerminals() {
            try {
                const terms = await getAvailableTerminalsIPC();
                if (!active) return;
                setAvailableTerminals(terms);

                let saved = '';
                try {
                    const res = await getValueBySessionIdIPC('default_terminal');
                    if (res) {
                        try {
                            saved = JSON.parse(res);
                        } catch {
                            saved = res;
                        }
                    }
                } catch (e) {
                    if (terms.length > 0) {
                        saved = terms[0];
                    }
                }
                if (active) {
                    setSelectedTerminal(saved);
                }
            } catch (err) {
                console.error("Failed to load terminals", err);
            }
        }
        loadTerminals();
        return () => {
            active = false;
        };
    }, []);

    const handleTerminalChange = async (v: string) => {
        setSelectedTerminal(v);
        try {
            await addOrUpdateBySessionIdIPC('default_terminal', JSON.stringify(v));
        } catch (e) {
            console.error("Failed to save default terminal in backend", e);
        }
    };

    const preferencesList = getGeneralPreferencesList(settings, updateSettings);

    if (availableTerminals.length > 0) {
        preferencesList.push({
            id: 'default-terminal',
            title: 'Default Terminal',
            desc: 'Choose your default terminal for project commands.',
            type: 'select',
            value: selectedTerminal,
            onChange: handleTerminalChange,
            options: availableTerminals.map(t => ({ value: t, label: t }))
        });
    }

    return (
        <div className="settings-section-padding">
            <h2 className="settings-section-header">
                {SETTINGS_GENERAL_ICON}
                General Preferences
            </h2>

            <div className="settings-flex-column-gap-24" style={{ maxWidth: '600px' }}>
                {preferencesList.map(item => (
                    <SettingItem key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

