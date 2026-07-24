import React from 'react';
import { SortOptions } from '../../../../components/ui/sortUi/SortOptions';
import type { MiscSortMode } from "../../../misc/types/types";
import type { SortOption } from '../../../../types/ui';

interface ZipSortBarProps {
    sortMode: MiscSortMode;
    onSortChange: (mode: MiscSortMode) => void;
}

const ZIP_SORT_OPTIONS: SortOption[] = [
    { id: 'size', label: 'Size' },
    { id: 'name', label: 'Name' },
];

export const ZipSortBar: React.FC<ZipSortBarProps> = ({ sortMode, onSortChange }) => {
    const sortMethod = sortMode.startsWith('size') ? 'size' : 'name';
    const sortAscending = sortMethod === 'size' ? sortMode === 'size-asc' : sortMode === 'name';

    const handleSortChange = (method: string) => {
        if (method === 'size') {
            onSortChange(sortAscending ? 'size-asc' : 'size');
        } else {
            onSortChange(sortAscending ? 'name' : 'name-desc');
        }
    };

    const handleAscendingChange = (asc: boolean) => {
        if (sortMethod === 'size') {
            onSortChange(asc ? 'size-asc' : 'size');
        } else {
            onSortChange(asc ? 'name' : 'name-desc');
        }
    };

    return (
        <SortOptions
            sortMethod={sortMethod}
            sortAscending={sortAscending}
            setSortAscending={handleAscendingChange}
            handleSortChange={handleSortChange}
            options={ZIP_SORT_OPTIONS}
            defaultSortMethodLabel="Size"
        />
    );
};
