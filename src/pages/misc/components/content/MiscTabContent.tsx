import React from 'react';
import { TYPE_COMING_SOON, TYPE_EXE_FILES } from '../../../../constants/tabs';
import type { useMisc } from '../../../../hooks/misc/useMisc';
import type { useBazarTab } from '../../../../hooks/bazar/useBazarTab';
import { EmptyDirectoriesTab } from './EmptyDirectoriesTab';
import { ExeFilesTab } from './ExeFilesTab';
import { ComingSoonTab } from './ComingSoonTab';

interface MiscTabContentProps {
    misc: ReturnType<typeof useMisc>;
    tab: ReturnType<typeof useBazarTab>;
}

export const MiscTabContent: React.FC<MiscTabContentProps> = ({ misc, tab }) => {
    if (misc.activeTab === TYPE_COMING_SOON) {
        return <ComingSoonTab />;
    }
    if (misc.activeTab === TYPE_EXE_FILES) {
        return <ExeFilesTab tab={tab} />;
    }

    return <EmptyDirectoriesTab tab={tab} />;
};
