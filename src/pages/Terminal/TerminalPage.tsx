import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import TerminalPanel from './TerminalPanel';

export const TerminalPage: React.FC = () => {
    return (
        <PageLayout title="Terminal" hideSearch={true}>
            <TerminalPanel />
        </PageLayout>
    );
};
