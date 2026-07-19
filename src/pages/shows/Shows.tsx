import React, { useRef } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from '../../hooks/shows/useShow';
import { ShowDetailPage } from './components/detail/ShowDetailPage';
import { ShowTabs } from './components/tabs/ShowTabs';
import { ShowList } from './components/list/ShowList';
import { EditMalNumberModal } from './components/ui/EditMalNumberModal';
import { AddAnimeModal } from './components/ui/AddAnimeModal';
import { ScanAnimeModal } from './components/ui/ScanAnimeModal';
import { EditImdbIdModal } from './components/ui/EditImdbIdModal';
import { AddShowModal } from './components/ui/AddShowModal';
import './css/Shows.css';

export const Shows: React.FC = () => {
    const renderCount = useRef(0);
    renderCount.current++;
    console.log(`[Shows] rendered: ${renderCount.current}`);
    const showHook = useShow();
    const { isAddAnimeOpen, setIsAddAnimeOpen, addAnimeQuery, addAnimeTargetShowId, handleOpenAddAnime, isScanAnimeOpen, setIsScanAnimeOpen, allShows, isAddShowOpen, setIsAddShowOpen, addShowQuery, addShowTargetShowId, handleOpenAddShow } = showHook;

    if (showHook.selectedShow) {
        return (
            <PageLayout hook={showHook} hideSearch={true}>
                <ShowDetailPage showHook={showHook} />
                <EditMalNumberModal showHook={showHook} />
                <EditImdbIdModal showHook={showHook} />
                {isAddAnimeOpen && <AddAnimeModal 
                    onClose={() => setIsAddAnimeOpen(false)} 
                    initialQuery={addAnimeQuery} 
                    targetShowId={addAnimeTargetShowId}
                    onLinkAction={showHook.updateMalIdForShow}
                />}
                {isScanAnimeOpen && <ScanAnimeModal
                    onClose={() => setIsScanAnimeOpen(false)}
                    shows={allShows.filter(s => !s.banned)}
                />}
                {isAddShowOpen && <AddShowModal 
                    onClose={() => setIsAddShowOpen(false)} 
                    initialQuery={addShowQuery} 
                    targetShowId={addShowTargetShowId}
                    onLinkAction={showHook.updateImdbIdForShow}
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
            <EditMalNumberModal showHook={showHook} />
            <EditImdbIdModal showHook={showHook} />
            {isAddAnimeOpen && <AddAnimeModal 
                onClose={() => setIsAddAnimeOpen(false)} 
                initialQuery={addAnimeQuery}
                targetShowId={addAnimeTargetShowId}
                onLinkAction={showHook.updateMalIdForShow}
            />}
            {isScanAnimeOpen && <ScanAnimeModal
                onClose={() => setIsScanAnimeOpen(false)}
                shows={allShows.filter(s => !s.banned)}
            />}
            {isAddShowOpen && <AddShowModal 
                onClose={() => setIsAddShowOpen(false)} 
                initialQuery={addShowQuery} 
                targetShowId={addShowTargetShowId}
                onLinkAction={showHook.updateImdbIdForShow}
            />}
        </PageLayout>
    );
};
