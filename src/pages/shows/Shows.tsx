import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from '../../hooks/shows/useShow';
import { ShowTabsOption } from './ShowTabsOption';
import { ShowTab } from './ShowTab';


export const Shows: React.FC = () => {

    const show = useShow();
    
    return (
        <PageLayout hook={show} >
            <ShowTabsOption show={show} />
            <div className="tab-content">
                <ShowTab show={show} tabType={show.activeTab} />
            </div>
        </PageLayout>
    );
};
