import React from 'react';
import type { useShow } from '../../../../hooks/shows/useShow';
import { ShowListHeader } from './header/ShowListHeader';
import { ShowListContent } from './content/ShowListContent';

interface ShowListProps {
    showHook: ReturnType<typeof useShow>
}

export const ShowList: React.FC<ShowListProps> = ({ showHook }) => {
    return (
        <>
            <ShowListHeader showHook={showHook} />
            <ShowListContent showHook={showHook} />
        </>
    );
};
