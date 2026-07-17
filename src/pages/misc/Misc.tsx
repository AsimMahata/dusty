import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useMisc } from '../../hooks/misc/useMisc';
import { useMiscChunkTab } from '../../hooks/misc/useMiscChunkTab';
import { useBazarTab } from '../../hooks/bazar/useBazarTab';
import { MiscTabs } from './components/tabs/MiscTabs';
import { MiscTabContent } from './components/content/MiscTabContent';

export const Misc: React.FC = () => {
    const misc = useMisc();
    const miscChunkTab = useMiscChunkTab(misc);
    const tab = useBazarTab(miscChunkTab);

    return (
        <PageLayout hook={misc}>
            <MiscTabs misc={misc} />
            <div className="tab-content">
                <MiscTabContent misc={misc} tab={tab} />
            </div>
        </PageLayout>
    );
};
