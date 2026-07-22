import React, { useState } from 'react';
import { ChunkItem } from '../../../bazar/ChunkItem';
import { ICONS } from '../../../../constants/icon';
import { getChunkFileIcon } from '../../../../utility/chunkIcon';
import { SortOptions } from '../../../ui/sortUi/SortOptions';
import type { TabHook } from "../../../../types/tabs";
import type { BaseItem, AnyItem } from "../../../../types/core";
import type { MediaSortMode } from "../../../../types/media";
import type { SortOption } from '../../../../types/ui';

interface MediaListProps<T extends BaseItem = AnyItem> {
    tab: TabHook<T>;
}
export const VISIBLE_COUNT = 60;

const MEDIA_SORT_OPTIONS: SortOption[] = [
    { id: 'name', label: 'Name' },
    { id: 'size', label: 'Size' },
    { id: 'type', label: 'Type' },
];

export function MediaList<T extends BaseItem>({ tab }: MediaListProps<T>) {
    const title = tab.title || "Unknown";
    const recentItems = tab.recentItems || [];
    const allItems = tab.allItems || [];
    const searchQuery = tab.searchQuery || "";
    const onCardClick = tab.onCardClick;
    const getCardActions = tab.getCardActions;

    const [sortMode, setSortMode] = useState<MediaSortMode>('name');
    const [visibleCount, setVisibleCount] = useState(50);

    const query = searchQuery.toLowerCase();

    // Reset visible count when data or search changes
    React.useEffect(() => {
        setVisibleCount(VISIBLE_COUNT);
    }, [allItems, query, sortMode]);

    const filterItems = (items: T[]) => items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        (item.metadata && item.metadata.toLowerCase().includes(query))
    );

    const sortItems = (items: T[], mode: MediaSortMode): T[] => {
        const pinned = items.filter(c => (c as any).is_pinned);
        const rest = items.filter(c => !(c as any).is_pinned);

        const sorted = [...rest].sort((a, b) => {
            const aRawSize = (a as any).rawSize ?? 0;
            const bRawSize = (b as any).rawSize ?? 0;
            
            const aExt = a.path ? a.path.split('.').pop() || '' : '';
            const bExt = b.path ? b.path.split('.').pop() || '' : '';

            switch (mode) {
                case 'name':      return a.title.localeCompare(b.title, undefined, { numeric: true });
                case 'name-desc': return b.title.localeCompare(a.title, undefined, { numeric: true });
                case 'size':      return bRawSize - aRawSize;
                case 'size-asc':  return aRawSize - bRawSize;
                case 'type':      return aExt.localeCompare(bExt) || a.title.localeCompare(b.title, undefined, { numeric: true });
            }
        });

        return [...pinned, ...sorted];
    };

    const filteredRecent = filterItems(recentItems);
    const filteredAll = filterItems(allItems);
    const sortedAll = sortItems(filteredAll, sortMode);

    // Progressive rendering chunker
    React.useEffect(() => {
        if (visibleCount < sortedAll.length) {
            const timer = setTimeout(() => {
                setVisibleCount(prev => prev + VISIBLE_COUNT);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [visibleCount, sortedAll.length]);

    const sortMethod = sortMode.startsWith('size') ? 'size' : (sortMode.startsWith('name') ? 'name' : 'type');
    const sortAscending = sortMethod === 'size' ? sortMode === 'size-asc' : sortMode === 'name';

    const handleSortChange = (method: string) => {
        if (method === 'size') {
            setSortMode(sortAscending ? 'size-asc' : 'size');
        } else if (method === 'name') {
            setSortMode(sortAscending ? 'name' : 'name-desc');
        } else {
            setSortMode('type');
        }
    };

    const handleAscendingChange = (asc: boolean) => {
        if (sortMethod === 'size') {
            setSortMode(asc ? 'size-asc' : 'size');
        } else if (sortMethod === 'name') {
            setSortMode(asc ? 'name' : 'name-desc');
        }
    };

    const renderSection = (sectionTitle: string, icon: React.ReactNode, items: T[], showSortBar: boolean = false) => {
        if (items.length === 0) return null;

        return (
            <div className="category-section" style={{ marginBottom: '24px' }}>
                <div className="section-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {icon}
                        {sectionTitle}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {showSortBar && (
                            <SortOptions
                                sortMethod={sortMethod}
                                sortAscending={sortAscending}
                                setSortAscending={handleAscendingChange}
                                handleSortChange={handleSortChange}
                                options={MEDIA_SORT_OPTIONS}
                                defaultSortMethodLabel="Name"
                            />
                        )}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                            {items.length}
                        </span>
                    </div>
                </div>
                <div className="chunk-list">
                    {items.map(item => {
                        const mediaItem = item as any;
                        
                        let ext = mediaItem.ext;
                        if (!ext && item.path) {
                            ext = item.path.split('.').pop() || '';
                        }
                        const itemIcon = getChunkFileIcon(ext);

                        return (
                            <ChunkItem
                                key={item.id}
                                chunk={{
                                    id: item.id,
                                    name: item.title,
                                    path: item.path || '',
                                    ext: ext,
                                    size: mediaItem.rawSize,
                                    is_pinned: mediaItem.is_pinned
                                }}
                                actions={getCardActions ? getCardActions(item) : []}
                                icon={itemIcon}
                                onDoubleClick={() => onCardClick?.(item)}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="media-list-container">
            {recentItems.length > 0 && renderSection("Recently Watched", ICONS.GENERAL.CLOCK, filteredRecent)}
            {renderSection(`All ${title}`, ICONS.GENERAL.LIST, sortedAll.slice(0, visibleCount), true)}
        </div>
    );
}
