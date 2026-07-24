import { SHOW_DEFAULT_STATUS_ICON } from '../../../constants/constants';
import { SHOW_COMPLETED_ICON } from '../../../constants/constants';
import { SHOW_WATCHING_ICON } from '../../../constants/constants';
import React from 'react';
import { SHOW_STATUS_WATCHING, SHOW_STATUS_COMPLETED } from '../../../constants/constants';


interface ShowStatusIconProps {
    status: string;
    statusColor: string;
}

export const ShowStatusIcon: React.FC<ShowStatusIconProps> = ({ status, statusColor }) => {
    const isWatching = status === SHOW_STATUS_WATCHING;
    const isCompleted = status === SHOW_STATUS_COMPLETED;

    return (
        <div className="show-grid-status-icon" style={{ color: statusColor }}>
            {isWatching && SHOW_WATCHING_ICON}
            {isCompleted && SHOW_COMPLETED_ICON}
            {!isWatching && !isCompleted && SHOW_DEFAULT_STATUS_ICON}
        </div>
    );
};
