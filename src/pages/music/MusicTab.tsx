
import React from 'react';
import { CategoryPage } from '../../components/category/CategoryPage';
import { ItemDetailPage } from '../../components/detail/ItemDetailPage';
import type { TabType } from '../../types/types';
import type { useMusic } from '../../hooks/music/useMusic';
import { useMusicTab } from '../../hooks/music/useMusicTab';

interface MusicTabProps {
    music: ReturnType<typeof useMusic>;
    tabType: TabType
}

export const MusicTab: React.FC<MusicTabProps> = ({ music, tabType }) => {
    const tab = useMusicTab(music, tabType);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {tab.goBack && (
                <div style={{ marginBottom: '16px' }}>
                    <button onClick={tab.goBack} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>
                        ← Back
                    </button>
                </div>
            )}
            {tab.selectedItem ? <ItemDetailPage tab={tab} /> : <CategoryPage tab={tab} />}
        </div>
    );
};
