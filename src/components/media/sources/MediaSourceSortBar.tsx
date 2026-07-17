import React from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ContextMenu } from '../../ui/ContextMenu';
import './MediaSources.css';

export type MediaSortMethod = 'title' | 'updated' | 'random';

interface MediaSourceSortBarProps {
    sortMethod: MediaSortMethod;
    sortAscending: boolean;
    onSortChange: (method: MediaSortMethod) => void;
    onDirectionToggle: () => void;
}

export const MediaSourceSortBar: React.FC<MediaSourceSortBarProps> = ({
    sortMethod,
    sortAscending,
    onSortChange,
    onDirectionToggle
}) => {
    const [menuPos, setMenuPos] = React.useState<{ x: number, y: number } | null>(null);

    const getSortLabel = () => {
        switch (sortMethod) {
            case 'title': return 'Title';
            case 'updated': return 'Updated Date';
            case 'random': return 'Random';
        }
    };

    return (
        <div className="media-sort-group">
            <button 
                className="media-sort-btn"
                onClick={(e) => { 
                    e.stopPropagation(); 
                    if (menuPos) {
                        setMenuPos(null);
                    } else {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPos({ x: rect.left, y: rect.bottom + 4 }); 
                    }
                }}
            >
                <span style={{ color: 'var(--text-muted)' }}>Sort by:</span> {getSortLabel()} <ChevronDown size={14} />
            </button>
            <button 
                className="media-sort-btn icon-only"
                onClick={onDirectionToggle} 
                disabled={sortMethod === 'random'}
                title={sortMethod === 'random' ? 'Cannot reverse random' : 'Reverse Order'}
            >
                {sortAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
            {menuPos && (
                <ContextMenu 
                    x={menuPos.x} 
                    y={menuPos.y} 
                    actions={[
                        { label: 'Title', onClick: () => { onSortChange('title'); setMenuPos(null); } },
                        { label: 'Updated Date', onClick: () => { onSortChange('updated'); setMenuPos(null); } },
                        { label: 'Random', onClick: () => { onSortChange('random'); setMenuPos(null); } }
                    ]} 
                    onClose={() => setMenuPos(null)} 
                />
            )}
        </div>
    );
};
