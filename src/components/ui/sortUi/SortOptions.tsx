import React, { useState } from 'react';
import { ContextMenu } from '../ContextMenu';

export interface Coordinates {
    x: number;
    y: number;
}
export interface SortOption {
    id: string;
    label: string;
}

import { SortLabelButton } from './SortLabelButton';
import { SortArrowButton } from './SortArrowButton';

interface SortOptionsProps {
    sortMethod: string;
    sortAscending: boolean;
    setSortAscending: (asc: boolean) => void;
    handleSortChange: (method: string) => void;
    options: SortOption[];
    defaultSortMethodLabel?: string;
}

export const SortOptions: React.FC<SortOptionsProps> = ({ 
    sortMethod, 
    sortAscending, 
    setSortAscending, 
    handleSortChange,
    options,
    defaultSortMethodLabel = 'Title'
}) => {
    const [sortMenuPos, setSortMenuPos] = useState<Coordinates | null>(null);
    const getSortLabel = () => options.find(o => o.id === sortMethod)?.label || defaultSortMethodLabel;

    return (
        <>
            <div className="show-sort-group">
                <SortLabelButton 
                    sortMenuPos={sortMenuPos} 
                    setSortMenuPos={setSortMenuPos} 
                    sortLabel={getSortLabel()} 
                />
                <SortArrowButton 
                    sortMethod={sortMethod} 
                    sortAscending={sortAscending} 
                    setSortAscending={setSortAscending} 
                />
            </div>
            {sortMenuPos && (
                <ContextMenu 
                    x={sortMenuPos.x} 
                    y={sortMenuPos.y} 
                    actions={options.map(opt => ({ label: opt.label, onClick: () => handleSortChange(opt.id) }))} 
                    onClose={() => setSortMenuPos(null)} 
                />
            )}
        </>
    );
};
