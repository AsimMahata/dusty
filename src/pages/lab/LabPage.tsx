import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { TokenizeTest } from './components/TokenizeTest';
import './css/Lab.css';

export const LabPage: React.FC = () => {
    return (
        <PageLayout title="Experiment Zone (Lab)" hideSearch showCloseButton>
            <div className="lab-container">
                <TokenizeTest />
            </div>
        </PageLayout>
    );
};
