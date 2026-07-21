import React from 'react';

interface RecentEpisodeTextProps {
    title: string;
    className?: string;
}

export const RecentEpisodeTitle: React.FC<RecentEpisodeTextProps> = ({ title, className = '' }) => (
    <span 
        className={className} 
        style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            overflowWrap: 'anywhere',
            lineHeight: '1.4'
        }}
        title={title}
    >
        {title}
    </span>
);

export const RecentEpisodeSubtitle: React.FC<RecentEpisodeTextProps> = ({ title, className = '' }) => (
    <span 
        className={className}
        style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            overflowWrap: 'anywhere'
        }}
        title={title}
    >
        {title}
    </span>
);
