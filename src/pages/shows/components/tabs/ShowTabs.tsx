import React from 'react';
import { TABS } from '../../constants/constants';
import { useShow } from '../../../../hooks/shows/useShow';
import { ContextMenu } from '../../../../components/ui/ContextMenu';
import type { ActionItem } from '../../../../types/types';
import { Play, Tv, ChevronDown } from 'lucide-react';
import { COLORS } from '../../../../constants/color';
import { useState, useRef } from 'react';

const DropdownButton: React.FC<{ label: string, actions: ActionItem[], className?: string }> = ({ label, actions, className }) => {
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (menuPos) {
            setMenuPos(null);
        } else if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPos({ x: rect.left, y: rect.bottom + 5 });
        }
    };

    return (
        <>
            <button 
                ref={buttonRef} 
                className={className} 
                onClick={handleClick}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
                {label} <ChevronDown size={14} />
            </button>
            {menuPos && (
                <ContextMenu
                    x={menuPos.x}
                    y={menuPos.y}
                    actions={actions}
                    onClose={() => setMenuPos(null)}
                />
            )}
        </>
    );
};

interface ShowTabsProps {
    showHook: ReturnType<typeof useShow>;
    onAddAnime?: () => void;
    onAddShow?: () => void;
}

export const ShowTabs: React.FC<ShowTabsProps> = ({ showHook, onAddAnime, onAddShow }) => {
    const { activeTab, setActiveTab, getCount } = showHook;
    
    return (
        <div className="show-tabs-container">
            <div className="show-tabs-list">
                {TABS.map(tab => {
                    const count = getCount(tab);
                    if (count === 0 && tab.id !== 'all' && tab.id !== 'watching' && tab.id !== 'seasonal') return null;
                    
                    return (
                        <div 
                            key={tab.id}
                            className={`show-tab-item ${activeTab.id === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.label} <span className="show-tab-count">{count}</span>
                        </div>
                    );
                })}
            </div>
            {onAddAnime && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <DropdownButton 
                        label="Scan" 
                        className="open-add-anime-btn" 
                        actions={[
                            {
                                label: 'Anime',
                                icon: <Play size={16} />,
                                color: COLORS.BASE.BLUE,
                                onClick: () => showHook.setIsScanAnimeOpen(true)
                            },
                            {
                                label: 'TV Show',
                                icon: <Tv size={16} />,
                                color: COLORS.BASE.ORANGE,
                                onClick: () => {
                                    // TODO: Implement TV show scan
                                    console.log("Scan TV Show clicked");
                                }
                            }
                        ]}
                    />
                    
                    <DropdownButton 
                        label="Add" 
                        className="open-add-anime-btn" 
                        actions={[
                            {
                                label: 'Anime',
                                icon: <Play size={16} />,
                                color: COLORS.BASE.BLUE,
                                onClick: onAddAnime ? onAddAnime : () => {}
                            },
                            {
                                label: 'TV Show',
                                icon: <Tv size={16} />,
                                color: COLORS.BASE.ORANGE,
                                onClick: onAddShow ? onAddShow : () => {}
                            }
                        ]}
                    />
                </div>
            )}
        </div>
    );
};

