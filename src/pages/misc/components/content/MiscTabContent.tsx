import React from 'react';
import { TYPE_COMING_SOON, TYPE_EXE_FILES, TYPE_JSON_FILES, TYPE_TEXT_FILES, TYPE_OFFICE_FILES } from '../../../../constants/tabs';
import type { useMisc } from '../../../../hooks/misc/useMisc';
import { EmptyDirectoriesTab } from './EmptyDirectoriesTab';
import { ExeFilesTab } from './ExeFilesTab';
import { JsonFilesTab } from './JsonFilesTab';
import { TextFilesTab } from './TextFilesTab';
import { OfficeFilesTab } from './OfficeFilesTab';
import { ComingSoonTab } from './ComingSoonTab';

interface MiscTabContentProps {
    misc: ReturnType<typeof useMisc>;
}

export const MiscTabContent: React.FC<MiscTabContentProps> = ({ misc }) => {
    if (misc.activeTab === TYPE_COMING_SOON) {
        return <ComingSoonTab />;
    }
    if (misc.activeTab === TYPE_EXE_FILES) {
        return <ExeFilesTab misc={misc} />;
    }
    if (misc.activeTab === TYPE_JSON_FILES) {
        return <JsonFilesTab misc={misc} />;
    }
    if (misc.activeTab === TYPE_TEXT_FILES) {
        return <TextFilesTab misc={misc} />;
    }
    if (misc.activeTab === TYPE_OFFICE_FILES) {
        return <OfficeFilesTab misc={misc} />;
    }

    return <EmptyDirectoriesTab misc={misc} />;
};
