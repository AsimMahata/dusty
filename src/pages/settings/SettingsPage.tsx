import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { TYPE_GENERAL, TYPE_DATA } from '../../constants/tabs';
import { SettingsTabs } from './components/tabs/SettingsTabs';
import { GeneralPreferences } from './components/general/GeneralPreferences';
import { DataManagement } from './components/data/DataManagement';
import './css/Settings.css';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<typeof TYPE_GENERAL | typeof TYPE_DATA>(TYPE_GENERAL);

    return (
        <PageLayout title="Settings" hideSearch showCloseButton>
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="tab-content">
                {activeTab === TYPE_GENERAL && <GeneralPreferences />}
                {activeTab === TYPE_DATA && <DataManagement />}
            </div>
        </PageLayout>
    );
};
