import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useMisc } from './hooks/useMisc';
import { MiscTabs } from './components/tabs/MiscTabs';
import { MiscTabContent } from './components/content/MiscTabContent';

export const Misc: React.FC = () => {
    const misc = useMisc();

    return (
        <PageLayout hook={misc}>
            <MiscTabs misc={misc} />
            <div className="tab-content">
                <MiscTabContent misc={misc} />
            </div>
        </PageLayout>
    );
};
