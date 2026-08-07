import React, { useRef } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from './hooks/useShow';
import { ShowDetailPage } from './components/detail/ShowDetailPage';
import { ShowTabs } from './components/tabs/ShowTabs';
import { ShowList } from './components/list/ShowList';
import { AddAnimeModal } from './components/ui/AddAnimeModal';
import { ScanAnimeModal } from './components/ui/ScanAnimeModal';
import { AddShowModal } from './components/ui/AddShowModal';
import { ScanShowModal } from './components/ui/ScanShowModal';
import './css/Shows.css';

export const Shows: React.FC = () => {
    const renderCount = useRef(0);
    renderCount.current++;

    const showHook = useShow();
    const { isAddAnimeOpen, setIsAddAnimeOpen, addAnimeQuery, addAnimeTargetShowId, handleOpenAddAnime, isScanAnimeOpen, setIsScanAnimeOpen, allShows, isAddShowOpen, setIsAddShowOpen, isScanShowOpen, setIsScanShowOpen, addShowQuery, addShowTargetShowId, handleOpenAddShow } = showHook;

    if (showHook.selectedShow) {
        return (
            <PageLayout hook={showHook} hideSearch={true}>
                <ShowDetailPage showHook={showHook} />
                {isAddAnimeOpen && <AddAnimeModal
                    onClose={() => setIsAddAnimeOpen(false)}
                    initialQuery={addAnimeQuery}
                    targetShowId={addAnimeTargetShowId}
                    onLinkAction={showHook.updateShowIdForShow}
                />}
                {isScanAnimeOpen && <ScanAnimeModal
                    onClose={() => setIsScanAnimeOpen(false)}
                    shows={allShows.filter(s => !s.banned && s.show_type === 'unknown')}
                />}
                {isAddShowOpen && <AddShowModal
                    onClose={() => setIsAddShowOpen(false)}
                    initialQuery={addShowQuery}
                    targetShowId={addShowTargetShowId}
                    onLinkAction={showHook.updateShowIdForShow}
                />}
                {isScanShowOpen && <ScanShowModal
                    onClose={() => setIsScanShowOpen(false)}
                    shows={allShows.filter(s => !s.banned && s.show_type === 'unknown')}
                />}
            </PageLayout>
        );
    }

    return (
        <PageLayout hook={showHook} hideSearch={false}>
            <div className="show-page-container">
                <ShowTabs showHook={showHook} onAddAnime={() => handleOpenAddAnime('')} onAddShow={() => handleOpenAddShow('')} />
                <ShowList showHook={showHook} />
            </div>
            {isAddAnimeOpen && <AddAnimeModal
                onClose={() => setIsAddAnimeOpen(false)}
                initialQuery={addAnimeQuery}
                targetShowId={addAnimeTargetShowId}
                onLinkAction={showHook.updateShowIdForShow}
            />}
            {isScanAnimeOpen && <ScanAnimeModal
                onClose={() => setIsScanAnimeOpen(false)}
                shows={allShows.filter(s => !s.banned && s.show_type === 'unknown')}
            />}
            {isAddShowOpen && <AddShowModal
                onClose={() => setIsAddShowOpen(false)}
                initialQuery={addShowQuery}
                targetShowId={addShowTargetShowId}
                onLinkAction={showHook.updateShowIdForShow}
            />}
            {isScanShowOpen && <ScanShowModal
                onClose={() => setIsScanShowOpen(false)}
                shows={allShows.filter(s => !s.banned && s.show_type === 'unknown')}
            />}
        </PageLayout>
    );
};
