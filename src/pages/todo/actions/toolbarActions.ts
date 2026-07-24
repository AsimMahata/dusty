import type { SortMethod } from '../types/types';

export const getToolbarSortActions = (setSortMethod: (method: SortMethod) => void) => [
    { label: 'Created Date', onClick: () => setSortMethod('created') },
    { label: 'Updated Date', onClick: () => setSortMethod('updated') },
    { label: 'Alphabetical', onClick: () => setSortMethod('alpha') },
    { label: 'Priority', onClick: () => setSortMethod('priority') },
    { label: 'Due Date', onClick: () => setSortMethod('due') },
    { label: 'Pinned First', onClick: () => setSortMethod('pinned') },
];
