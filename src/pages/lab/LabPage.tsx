import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { FlaskConical, LayoutDashboard, BarChart3, FileText } from 'lucide-react';
import { LabTabs } from './components/tabs/LabTabs';
import { ApiConsole } from './components/console/ApiConsole';
import { DatabaseViewer } from './components/database/DatabaseViewer';
import { SystemInfoViewer } from './components/system/SystemInfoViewer';
import { TokenizeTest } from './components/tokenizer/TokenizeTest';
import { ConfigInspector } from './components/config/ConfigInspector';
import { ThemeInspector } from './components/theme/ThemeInspector';
import { ExperimentOverview } from './components/experiment/ExperimentOverview';
import { ExperimentResults } from './components/experiment/ExperimentResults';
import { ExperimentLogViewer } from './components/experiment/ExperimentLogViewer';
import './css/Lab.css';
import { useLab } from './hooks/useLab';

export const LabPage: React.FC = () => {
    const {
        tabs,
        activeTabId,
        activeTab,
        selectTab,
        experimentSubTab,
        setExperimentSubTab,
        experimentName,
        setExperimentName,
        status,
        startExperiment,
        stopExperiment,
        resetExperiment,
        logPath,
        setLogPath,
        metrics,
        resultsData
    } = useLab();

    const renderActiveModule = () => {
        switch (activeTabId) {
            case 'experiment':
                return (
                    <div className="experiment-workspace">
                        {/* Sub-navigation for Experiment (Overview, Results, Log) */}
                        <div className="experiment-subnav font-mono">
                            <button
                                type="button"
                                className={`subnav-btn ${experimentSubTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setExperimentSubTab('overview')}
                            >
                                <LayoutDashboard size={15} /> Overview
                            </button>
                            <button
                                type="button"
                                className={`subnav-btn ${experimentSubTab === 'results' ? 'active' : ''}`}
                                onClick={() => setExperimentSubTab('results')}
                            >
                                <BarChart3 size={15} /> Results
                            </button>
                            <button
                                type="button"
                                className={`subnav-btn ${experimentSubTab === 'log' ? 'active' : ''}`}
                                onClick={() => setExperimentSubTab('log')}
                            >
                                <FileText size={15} /> Log
                                {status === 'running' && <span className="pulse-dot inline-dot" />}
                            </button>
                        </div>

                        {/* Sub-tab content */}
                        <div className="experiment-subcontent">
                            {experimentSubTab === 'overview' && (
                                <ExperimentOverview
                                    experimentName={experimentName}
                                    setExperimentName={setExperimentName}
                                    status={status}
                                    onStartExperiment={startExperiment}
                                    onStopExperiment={stopExperiment}
                                    onResetExperiment={resetExperiment}
                                    logPath={logPath}
                                    metrics={metrics}
                                    onSwitchToLog={() => setExperimentSubTab('log')}
                                />
                            )}
                            {experimentSubTab === 'results' && (
                                <ExperimentResults
                                    experimentName={experimentName}
                                    resultsData={resultsData}
                                    status={status}
                                />
                            )}
                            {experimentSubTab === 'log' && (
                                <ExperimentLogViewer
                                    logPath={logPath}
                                    setLogPath={setLogPath}
                                    isExperimentRunning={status === 'running'}
                                />
                            )}
                        </div>
                    </div>
                );
            case 'api':
                return <ApiConsole />;
            case 'database':
                return <DatabaseViewer />;
            case 'system':
                return <SystemInfoViewer />;
            case 'tokenizer':
                return <TokenizeTest />;
            case 'config':
                return <ConfigInspector />;
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
