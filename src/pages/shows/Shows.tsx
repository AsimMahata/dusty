import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from '../../hooks/shows/useShow';
import { TabsOption } from '../../components/ui/TabsOption';
import { ShowTab } from './ShowTab';


export const Shows: React.FC = () => {

    const show = useShow();

    return (
        <PageLayout hook={show} >
            <TabsOption

                isItemSelected={show.isItemSelected}
                activeTab={show.activeTab}
                setActiveTab={show.setActiveTab}
                tabs={show.tabs}
            />
            <div className="tab-content">
                <ShowTab show={show} tabType={show.activeTab.type} />
            </div>
        </PageLayout>
    );
};
