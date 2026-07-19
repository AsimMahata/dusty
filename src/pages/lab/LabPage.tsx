import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { TokenizeTest } from './components/TokenizeTest';
import { DatabaseViewer } from './components/DatabaseViewer';
import { SystemInfoViewer } from './components/SystemInfoViewer';
import './css/Lab.css';

export const LabPage: React.FC = () => {
    return (
        <PageLayout title="Experiment Zone (Lab)" hideSearch showCloseButton>
            <div className="lab-container">
                <SystemInfoViewer />
                <TokenizeTest />
                <DatabaseViewer />
            </div>
        </PageLayout>
    );
};
