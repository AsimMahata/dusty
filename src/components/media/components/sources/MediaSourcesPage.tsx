import React, { useState, useMemo, useEffect } from 'react';
import type { useMedia } from '../../../../hooks/media/useMedia';
import { MediaSourceSortBar } from './MediaSourceSortBar';
import { MediaSourceGrid } from './grid/MediaSourceGrid';
import { LABELS } from '../../constants/labels';
import '../../css/MediaSources.css';
import type { MediaDir } from "../../../../types/media";
import type { MediaSortMethod } from "../../../../types/media";
import type { MediaSourceItem } from "../../../../types/media";
import { getSortMethodMediaSourcesPage, getDefaultSourcesSortMethod, setSortMethodMediaSourcesPage, getSortAscendingMediaSourcesPage, getDefaultSourcesSortAscending, setSortAscendingMediaSourcesPage } from '../../../../session/media/sort';

interface MediaSourcesPageProps {
    media: ReturnType<typeof useMedia>;
}

const getExtensionsForDir = (dir: MediaDir): string[] => {
    const extSet = new Set<string>();
    const gather = (d: MediaDir) => {
        d.media.forEach(m => {
            if (m.ext) extSet.add(m.ext.toLowerCase());
        });
        d.childs.forEach(c => gather(c));
    };
    gather(dir);
    return Array.from(extSet).slice(0, 4); // limit to 4 extensions
};

export const MediaSourcesPage: React.FC<MediaSourcesPageProps> = ({ media }) => {
    const [sortMethod, setSortMethodState] = useState<MediaSortMethod>(getDefaultSourcesSortMethod());
    const [sortAscending, setSortAscendingState] = useState<boolean>(getDefaultSourcesSortAscending());
    const [randomSeed, setRandomSeed] = useState<number>(Math.random());

    async function fetchSessionData() {
        try {
            const method = await getSortMethodMediaSourcesPage();
            setSortMethodState(method);
        } catch (e) {}
        try {
            const ascending = await getSortAscendingMediaSourcesPage();
            setSortAscendingState(ascending);
        } catch (e) {}
    }

    useEffect(() => {
        fetchSessionData();
    }, []);

    const setSortMethod = (method: MediaSortMethod) => {
        setSortMethodState(method);
        void setSortMethodMediaSourcesPage(method);
    };

    const setSortAscending = (ascending: boolean) => {
        setSortAscendingState(ascending);
        void setSortAscendingMediaSourcesPage(ascending);
    };
    
    // In a real app we might persist pins to storage. 
    // Here we'll just keep it in state for the session or assume user handles it if added later.
    const [pinnedMap, setPinnedMap] = useState<Record<string, boolean>>({});

    const handlePinToggle = (item: MediaSourceItem) => {
        setPinnedMap(prev => ({
            ...prev,
            [item.id]: !prev[item.id]
        }));
    };

    const handleSortChange = (method: MediaSortMethod) => {
        setSortMethod(method);
        if (method === 'random') {
            setRandomSeed(Math.random());
            setSortAscending(true);
        } else {
            setSortAscending(true);
        }
    };

    const handleOpen = (item: MediaSourceItem) => {
        const childDir = media.mediaDirs.find(c => c.path === item.path);
        if (childDir) {
            media.handleFolderClick(childDir);
        }
    };

    const query = (media.searchQuery || "").toLowerCase();
    
    const allItems = (media.rootFolderItems || []) as unknown as MediaSourceItem[];
    
    const filteredItems = useMemo(() => {
        return allItems.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.subtitle?.toLowerCase().includes(query)
        );
    }, [allItems, query]);

    const sortedItems = useMemo(() => {
        let result = [...filteredItems];
        
        result.sort((a, b) => {
            const aPinned = pinnedMap[a.id];
            const bPinned = pinnedMap[b.id];
            
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;

            let cmp = 0;
            if (sortMethod === 'title') {
                cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            } else if (sortMethod === 'random') {
                const hash = (str: string) => {
                    let h = 0;
                    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
                    return h;
                };
                cmp = hash(a.id + randomSeed) - hash(b.id + randomSeed);
            } else {
                cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            }

            return sortAscending ? cmp : -cmp;
        });
        
        return result;
    }, [filteredItems, sortMethod, sortAscending, randomSeed, pinnedMap]);

    const extensionsMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        allItems.forEach(item => {
            if (item.path) {
                const dir = media.mediaDirs.find(d => d.path === item.path);
                if (dir) {
                    map[item.path] = getExtensionsForDir(dir);
                }
            }
        });
        return map;
    }, [allItems, media.mediaDirs]);

    return (
        <div className="media-sources-container" data-media-type={media.mediaType}>
            <div className="media-sources-header">
                <div className="media-sources-title">
                    {LABELS.SOURCES} <span className="media-sources-count">{sortedItems.length}</span>
                </div>
                <MediaSourceSortBar 
                    sortMethod={sortMethod}
                    sortAscending={sortAscending}
                    onSortChange={handleSortChange}
                    onDirectionToggle={() => sortMethod !== 'random' && setSortAscending(!sortAscending)}
                />
            </div>
            
            {sortedItems.length > 0 ? (
                <MediaSourceGrid 
                    items={sortedItems}
                    mediaType={media.mediaType}
                    extensionsMap={extensionsMap}
                    pinnedMap={pinnedMap}
                    onOpen={handleOpen}
                    onPinToggle={handlePinToggle}
                />
            ) : (
                <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
                    {query ? `No sources found for "${query}"` : LABELS.NO_SOURCES}
                </div>
            )}
        </div>
    );
};
