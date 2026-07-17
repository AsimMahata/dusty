import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SortArrowButtonProps {
    sortMethod: string;
    sortAscending: boolean;
    setSortAscending: (asc: boolean) => void;
}

export const SortArrowButton: React.FC<SortArrowButtonProps> = ({ sortMethod, sortAscending, setSortAscending }) => {
    return (
        <button 
            className="show-sort-btn icon-only"
            onClick={() => sortMethod !== 'random' && setSortAscending(!sortAscending)} 
            disabled={sortMethod === 'random'}
            title={sortMethod === 'random' ? 'Cannot reverse random' : 'Reverse Order'}
        >
            {sortAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
    );
};
