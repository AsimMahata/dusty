import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useShow } from '../../hooks/shows/useShow';
import { useShowTab } from '../../hooks/shows/useShowTab';
import { ShowPosterCard } from './components/ShowPosterCard';
import { ShowCompactCard } from './components/ShowCompactCard';
import { ShowGridCard } from './components/ShowGridCard';
import { ShowDetailPage } from './components/ShowDetailPage';
import { ContextMenu } from '../../components/ui/ContextMenu';
import { List, Grid, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import './Shows.css';
import { type ShowStatus, type ShowResult, type ItemCollection } from '../../types/types';

type ShowTabStatus = 'all' | ShowStatus | 'banned';

const TABS: { id: ShowTabStatus, label: string }[] = [
    { id: 'all', label: 'All Shows' },
    { id: 'watching', label: 'Watching' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'planned', label: 'Planned' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'banned', label: 'Banned' }
];

export const Shows: React.FC = () => {
    const show = useShow();
    const showTabHookNormal = useShowTab(show, 'normal');
    const showTabHookBanned = useShowTab(show, 'banned');

    const [activeTab, setActiveTab] = useState<ShowTabStatus>('watching');
    const [isGridLayout, setIsGridLayout] = useState(false);
    const [selectedShow, setSelectedShow] = useState<ShowResult | null>(null);
    const [sortMethod, setSortMethod] = useState<'title' | 'last_watched' | 'status' | 'random'>('last_watched');
    const [sortAscending, setSortAscending] = useState<boolean>(false);
    const [randomSeed, setRandomSeed] = useState<number>(Math.random());
    const [sortMenuPos, setSortMenuPos] = useState<{ x: number, y: number } | null>(null);
    const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>(() => {
        try { return JSON.parse(localStorage.getItem('dusk_last_watched') || '{}'); } 
        catch { return {}; }
    });

    const handleShowOpen = (s: ShowResult) => {
        const newMap = { ...lastWatchedMap, [s.id]: Date.now() };
        setLastWatchedMap(newMap);
        localStorage.setItem('dusk_last_watched', JSON.stringify(newMap));
        setSelectedShow(s);
    };

    const filteredShows = useMemo(() => {
        let shows = show.allShows;
        
        if (activeTab === 'banned') {
            return shows.filter(s => s.banned);
        }
        
        // Exclude banned shows if we are not explicitly handling them, or just use what we have
        shows = shows.filter(s => !s.banned);

        if (activeTab === 'all') {
            return shows;
        }
        return shows.filter(s => s.status === activeTab);
    }, [show.allShows, activeTab]);

    const STATUS_PRIORITY: Record<string, number> = {
        'watching': 1,
        'planned': 2,
        'on_hold': 3,
        'completed': 4,
        'dropped': 5,
    };

    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        return hash;
    };

    // Apply sorting logic (pinned first, then by selected sort mode)
    const sortedShows = useMemo(() => {
        let result = [...filteredShows];
        
        result.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            
            let cmp = 0;
            if (sortMethod === 'last_watched') {
                const timeA = lastWatchedMap[a.id] || 0;
                const timeB = lastWatchedMap[b.id] || 0;
                cmp = timeA - timeB;
            } else if (sortMethod === 'status') {
                const pA = STATUS_PRIORITY[a.status] || 99;
                const pB = STATUS_PRIORITY[b.status] || 99;
                cmp = pA - pB;
                if (cmp === 0) cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            } else if (sortMethod === 'random') {
                cmp = hashString(a.id + randomSeed) - hashString(b.id + randomSeed);
            } else {
                cmp = a.title.localeCompare(b.title, undefined, { numeric: true });
            }
            
            return sortAscending ? cmp : -cmp;
        });
        
        return result;
    }, [filteredShows, sortMethod, sortAscending, randomSeed, lastWatchedMap]);

    const handleSortChange = (method: 'title' | 'last_watched' | 'status' | 'random') => {
        setSortMethod(method);
        if (method === 'random') {
            setRandomSeed(Math.random());
            setSortAscending(true);
        } else if (method === 'last_watched') {
            setSortAscending(false);
        } else {
            setSortAscending(true);
        }
    };

    const getSortLabel = () => {
        switch (sortMethod) {
            case 'title': return 'Title';
            case 'last_watched': return 'Last Watched';
            case 'status': return 'Status';
            case 'random': return 'Random';
        }
    };

    const getCount = (status: ShowTabStatus) => {
        if (status === 'banned') return show.allShows.filter(s => s.banned).length;
        
        const shows = show.allShows.filter(s => !s.banned);
        if (status === 'all') return shows.length;
        return shows.filter(s => s.status === status).length;
    };

    const getActionsForShow = (item: ShowResult) => {
        const itemCollection: ItemCollection = {
            id: item.id,
            title: item.title,
            subtitle: '',
            is_pinned: item.pinned,
            status: item.status,
            path: item.dir,
            is_dir: false
        };
        const currentHook = activeTab === 'banned' ? showTabHookBanned : showTabHookNormal;
        return currentHook.getCardActions(itemCollection);
    };

    if (selectedShow) {
        return (
            <PageLayout hook={show} hideSearch={true}>
                <ShowDetailPage 
                    show={selectedShow}
                    onBack={() => setSelectedShow(null)}
                    actions={getActionsForShow(selectedShow)}
                    filteredShows={show.allShows}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout hook={show} hideSearch={false}>
            <div className="show-page-container">
                <div className="show-tabs-container">
                    {TABS.map(tab => {
                        const count = getCount(tab.id);
                        // Optional: skip rendering tabs with 0 count except 'all'
                        if (count === 0 && tab.id !== 'all' && tab.id !== 'watching') return null;
                        
                        return (
                            <div 
                                key={tab.id}
                                className={`show-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label} <span className="show-tab-count">{count}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="show-list-header">
                    <div className="show-list-title">
                        {TABS.find(t => t.id === activeTab)?.label} ({getCount(activeTab)})
                    </div>
                    <div className="show-list-actions">
                        <div className="show-sort-group">
                            <button 
                                className="show-sort-btn"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if (sortMenuPos) {
                                        setSortMenuPos(null);
                                    } else {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setSortMenuPos({ x: rect.left, y: rect.bottom + 4 }); 
                                    }
                                }}
                            >
                                <span style={{ color: 'var(--text-muted)' }}>Sort by:</span> {getSortLabel()} <ChevronDown size={14} />
                            </button>
                            <button 
                                className="show-sort-btn icon-only"
                                onClick={() => sortMethod !== 'random' && setSortAscending(!sortAscending)} 
                                disabled={sortMethod === 'random'}
                                title={sortMethod === 'random' ? 'Cannot reverse random' : 'Reverse Order'}
                            >
                                {sortAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            </button>
                        </div>
                        {sortMenuPos && (
                            <ContextMenu 
                                x={sortMenuPos.x} 
                                y={sortMenuPos.y} 
                                actions={[
                                    { label: 'Title', onClick: () => handleSortChange('title') },
                                    { label: 'Status Priority', onClick: () => handleSortChange('status') },
                                    { label: 'Last Watched', onClick: () => handleSortChange('last_watched') },
                                    { label: 'Random', onClick: () => handleSortChange('random') }
                                ]} 
                                onClose={() => setSortMenuPos(null)} 
                            />
                        )}
                        <div className="show-layout-toggles">
                            <div 
                                className={`show-layout-toggle ${!isGridLayout ? 'active' : ''}`}
                                onClick={() => setIsGridLayout(false)}
                            >
                                <List size={16} />
                            </div>
                            <div 
                                className={`show-layout-toggle ${isGridLayout ? 'active' : ''}`}
                                onClick={() => setIsGridLayout(true)}
                            >
                                <Grid size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`show-list-content ${isGridLayout ? 'grid-view' : ''}`}>
                    {sortedShows.map(item => {
                        if (isGridLayout) {
                            return (
                                <ShowGridCard 
                                    key={item.id} 
                                    show={item} 
                                    onDoubleClick={handleShowOpen}
                                    actions={getActionsForShow(item)}
                                />
                            );
                        }

                        if (item.malNo) {
                            return (
                                <ShowPosterCard 
                                    key={item.id} 
                                    show={item} 
                                    onDoubleClick={handleShowOpen}
                                    actions={getActionsForShow(item)}
                                />
                            );
                        }
                        return (
                            <ShowCompactCard 
                                key={item.id} 
                                show={item} 
                                onDoubleClick={handleShowOpen}
                                actions={getActionsForShow(item)}
                            />
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
};
