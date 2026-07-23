import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { FlaskConical } from 'lucide-react';
import { useLab } from '../../hooks/lab/useLab';
import { LabTabs } from './components/tabs/LabTabs';
import { ApiConsole } from './components/console/ApiConsole';
import { DatabaseViewer } from './components/database/DatabaseViewer';
import { SystemInfoViewer } from './components/system/SystemInfoViewer';
import { TokenizeTest } from './components/tokenizer/TokenizeTest';
import { SessionInspector } from './components/session/SessionInspector';
import { ThemeInspector } from './components/theme/ThemeInspector';
import './css/Lab.css';

export const LabPage: React.FC = () => {
    const { tabs, activeTabId, activeTab, selectTab } = useLab();

    const renderActiveModule = () => {
        switch (activeTabId) {
            case 'api':
                return <ApiConsole />;
            case 'database':
                return <DatabaseViewer />;
            case 'system':
                return <SystemInfoViewer />;
            case 'tokenizer':
                return <TokenizeTest />;
            case 'session':
                return <SessionInspector />;
            case 'theme':
                return <ThemeInspector />;
            default:
                return <ApiConsole />;
        }
    };

    return (
        <PageLayout title="Experiment Zone (Lab)" hideSearch showCloseButton>
            <div className="lab-workbench-container">
                {/* Header Banner */}
                <div className="lab-header-banner">
                    <div>
                        <h2 className="lab-header-title">
                            <FlaskConical size={24} style={{ color: 'var(--accent)' }} />
                            Developer Cockpit & API Lab
                        </h2>
                        <p className="lab-header-subtitle">
                            {activeTab.description}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="api-status-badge success">
                            Dusty Workbench Active
                        </span>
                    </div>
                </div>

                {/* Module Navigation Tabs */}
                <LabTabs
                    tabs={tabs}
                    activeTabId={activeTabId}
                    selectTab={selectTab}
                />

                {/* Main Content Workspace Panel */}
                <div className="lab-panel-content">
                    {renderActiveModule()}
                </div>
            </div>
        </PageLayout>
    );
};

export default LabPage;
