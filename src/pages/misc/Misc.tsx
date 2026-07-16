import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ChunkList } from '../../components/bazar/ChunkList';
import { useMisc } from '../../hooks/misc/useMisc';
import { useMiscChunkTab } from '../../hooks/misc/useMiscChunkTab';
import { useBazarTab } from '../../hooks/bazar/useBazarTab';
import { ICONS } from '../../constants/icon';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TITLE_COMING_SOON, TITLE_EMPTY_DIRECTORIES } from '../../constants/tabs';

export const Misc: React.FC = () => {
    const misc = useMisc();
    const miscChunkTab = useMiscChunkTab(misc);
    const tab = useBazarTab(miscChunkTab);

    const renderContent = () => {
        if (misc.activeTab === TYPE_COMING_SOON) {
            return (
                <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <h2>{TITLE_COMING_SOON}...</h2>
                </div>
            );
        }

        return (
            <ChunkList
                chunks={tab.visibleChunks}
                getChunkActions={tab.getChunkActions}
                emptyIcon={ICONS.FILE.FOLDER_EMPTY}
                emptyTitle="No Empty Directories Found"
                emptyDesc="No empty folders were detected. The scan may still be running."
            />
        );
    };

    return (
        <PageLayout hook={misc}>
            <div className="tabs-container">
                <button
                    className={`tab-btn ${misc.activeTab === TYPE_EMPTY_DIRECTORIES ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(TYPE_EMPTY_DIRECTORIES)}
                >
                    {TITLE_EMPTY_DIRECTORIES}
                </button>
                <button
                    className={`tab-btn ${misc.activeTab === TYPE_COMING_SOON ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(TYPE_COMING_SOON)}
                >
                    {TITLE_COMING_SOON}
                </button>
            </div>

            <div className="tab-content">
                {renderContent()}
            </div>
        </PageLayout>
    );
};
