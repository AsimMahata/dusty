import React from 'react';
import { useSettings } from '../../../../contexts/SettingsContext';
import { SETTINGS_GENERAL_ICON } from '../../../../constants/icon';
import { getGeneralPreferencesList } from '../../actions/getGeneralPreferencesList';
import { SettingItem } from './SettingItem';

export const GeneralPreferences: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    return (
        <div className="settings-section-padding">
            <h2 className="settings-section-header">
                {SETTINGS_GENERAL_ICON}
                General Preferences
            </h2>

            <div className="settings-flex-column-gap-24" style={{ maxWidth: '600px' }}>
                {getGeneralPreferencesList(settings, updateSettings).map(item => (
                    <SettingItem key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};
