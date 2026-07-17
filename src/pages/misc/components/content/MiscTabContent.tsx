import React from 'react';
import { TYPE_COMING_SOON } from '../../../../constants/tabs';
import type { useMisc } from '../../../../hooks/misc/useMisc';
import type { useBazarTab } from '../../../../hooks/bazar/useBazarTab';
import { EmptyDirectoriesTab } from './EmptyDirectoriesTab';
import { ComingSoonTab } from './ComingSoonTab';

interface MiscTabContentProps {
    misc: ReturnType<typeof useMisc>;
    tab: ReturnType<typeof useBazarTab>;
}

export const MiscTabContent: React.FC<MiscTabContentProps> = ({ misc, tab }) => {
    if (misc.activeTab === TYPE_COMING_SOON) {
        return <ComingSoonTab />;
    }

    return <EmptyDirectoriesTab tab={tab} />;
};
