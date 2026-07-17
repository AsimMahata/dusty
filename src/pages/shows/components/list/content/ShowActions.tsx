import React from 'react';
import { ActionMenu } from '../../../../../components/ui/ActionMenu';
import type { ActionItem } from '../../../../../types/types';

interface ShowActionsProps {
    actions: ActionItem[];
}

export const ShowActions: React.FC<ShowActionsProps> = ({ actions }) => {
    return (
        <div className="show-grid-actions-overlay">
            <div className="show-grid-action-btn">
                <ActionMenu actions={actions} />
            </div>
        </div>
    );
};
