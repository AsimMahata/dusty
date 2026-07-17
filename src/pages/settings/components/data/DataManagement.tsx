import React from 'react';
import { DangerZone } from './DangerZone';
import { SETTINGS_DATA_ICON } from '../../../../constants/icon';

export const DataManagement: React.FC = () => {
    return (
        <div className="settings-section-padding">
            <h2 className="settings-section-header">
                {SETTINGS_DATA_ICON}
                Data Management
            </h2>
            <DangerZone />
        </div>
    );
};
