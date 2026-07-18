import React, { useRef, useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from '../../hooks/shows/useShow';
import { ShowDetailPage } from './components/detail/ShowDetailPage';
import { ShowTabs } from './components/tabs/ShowTabs';
import { ShowList } from './components/list/ShowList';
import { EditMalNumberModal } from './components/ui/EditMalNumberModal';
import { AddAnimeModal } from './components/ui/AddAnimeModal';
import './css/Shows.css';

export const Shows: React.FC = () => {
    const renderCount = useRef(0);
    renderCount.current++;
    console.log(`[Shows] rendered: ${renderCount.current}`);

    const showHook = useShow();
    const [isAddAnimeOpen, setIsAddAnimeOpen] = useState(false);

    if (showHook.selectedShow) {
        return (
            <PageLayout hook={showHook} hideSearch={true}>
                <ShowDetailPage showHook={showHook} />
                <EditMalNumberModal showHook={showHook} />
            </PageLayout>
        );
    }

    return (
        <PageLayout hook={showHook} hideSearch={false}>
            <div className="show-page-container">
                <ShowTabs showHook={showHook} onAddAnime={() => setIsAddAnimeOpen(true)} />
                <ShowList showHook={showHook} />
            </div>
            <EditMalNumberModal showHook={showHook} />
            {isAddAnimeOpen && <AddAnimeModal onClose={() => setIsAddAnimeOpen(false)} />}
        </PageLayout>
    );
};
