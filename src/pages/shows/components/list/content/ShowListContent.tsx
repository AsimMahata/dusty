import React from 'react';
import { ShowGridCard } from './ShowGridCard';
import { ShowPosterCard } from './ShowPosterCard';
import { ShowCompactCard } from './ShowCompactCard';
import type { useShow } from '../../../../../hooks/shows/useShow';

interface ShowListContentProps {
    showHook: ReturnType<typeof useShow>
}

export const ShowListContent: React.FC<ShowListContentProps> = ({ showHook }) => {
    const { sortedShows, isGridLayout, handleShowOpen, getActionsForShow } = showHook;
    return (
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
    );
};

