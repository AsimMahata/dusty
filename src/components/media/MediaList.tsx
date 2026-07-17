import React, { useState } from 'react';
import type { TabHook, BaseItem, AnyItem } from '../../types/types';
import { ChunkItem } from '../bazar/ChunkItem';
import { ICONS } from '../../constants/icon';
import { getChunkFileIcon } from '../../utility/chunkIcon';

interface MediaListProps<T extends BaseItem = AnyItem> {
    tab: TabHook<T>;
}

export type MediaSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';

const SORT_OPTIONS: { mode: MediaSortMode; label: string }[] = [
    { mode: 'name',      label: 'A → Z' },
    { mode: 'name-desc', label: 'Z → A' },
    { mode: 'size',      label: 'Largest' },
    { mode: 'size-asc',  label: 'Smallest' },
    { mode: 'type',      label: 'Type' },
];

export function MediaList<T extends BaseItem>({ tab }: MediaListProps<T>) {
    const title = tab.title || "Unknown";
    const recentItems = tab.recentItems || [];
    const allItems = tab.allItems || [];
    const searchQuery = tab.searchQuery || "";
    const onCardClick = tab.onCardClick;
    const getCardActions = tab.getCardActions;

    const [sortMode, setSortMode] = useState<MediaSortMode>('name');

    const query = searchQuery.toLowerCase();

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
                            <div className="zip-sort-bar" style={{ marginBottom: 0 }}>
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.mode}
                                        className={`zip-sort-btn ${sortMode === opt.mode ? 'active' : ''}`}
                                        onClick={() => setSortMode(opt.mode)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                            {items.length}
                        </span>
                    </div>
                </div>
                <div className="chunk-list">
                    {items.map(item => {
                        const mediaItem = item as any;
                        
                        let ext = '';
                        if (!mediaItem.is_dir && item.path) {
                            const parts = item.path.split('.');
                            if (parts.length > 1) {
                                ext = parts[parts.length - 1];
                            }
                        }
                        
                        const rowIcon = mediaItem.is_dir ? item.icon : getChunkFileIcon(ext);

                        return (
                            <ChunkItem
                                key={item.id}
                                name={item.title}
                                icon={rowIcon}
                                extLabel={item.metadata || (ext ? ext.toUpperCase() : undefined)}
                                sizeLabel={mediaItem.size}
                                path={item.path}
                                isPinned={mediaItem.is_pinned}
                                actions={getCardActions ? getCardActions(item) : []}
                                onDoubleClick={() => onCardClick?.(item)}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="category-page">
            {renderSection("Recent", ICONS.GENERAL.CLOCK, filteredRecent)}

            {sortedAll.length > 0 ? (
                renderSection(`All ${title}`, tab.defaultIcon || ICONS.GENERAL.LIST, sortedAll, true)
            ) : (
                <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
                    {searchQuery ? `No results found for "${searchQuery}"` : "No results found"}
                </div>
            )}
        </div>
    );
}
