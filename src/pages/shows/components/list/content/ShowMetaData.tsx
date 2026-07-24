import React from 'react';
import { Star } from 'lucide-react';
import { ShowStatusIcon } from './ShowStatusIcon';
import { PinDot } from '../../../../../components/ui/PinDot';
import type { ShowResult } from '../../../types/types';

interface ShowMetaDataProps {
    show: ShowResult;
    statusColor: string;
    totalEpisodes: number | string;
    rating: number;
}

export const ShowMetaData: React.FC<ShowMetaDataProps> = ({ show, statusColor, totalEpisodes, rating }) => {
    return (
        <div className="show-grid-content">
            <div className="show-grid-title" title={show.title}>
                {show.title}
                {show.pinned && <PinDot />}
            </div>

            <div className="show-grid-meta">
                <div className="show-grid-status">
                    <ShowStatusIcon status={show.status} statusColor={statusColor} />
                    EP {show.episodes?.length || 0} / {totalEpisodes}
                </div>
                {rating > 0 && (
                    <div className="show-grid-rating">
                        <Star size={12} className="star-icon" /> {rating}
                    </div>
                )}
            </div>
        </div>
    );
};
