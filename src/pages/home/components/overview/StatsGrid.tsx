import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeContext } from '../../contexts/HomeContext';
import { StatBox } from './StatBox';
import { HOME_STATS_CONFIG } from '../../constants/constants';

export const StatsGrid: React.FC = () => {
    const navigate = useNavigate();
    const { overviewStats } = useHomeContext();

    return (
        <div className="overview-stats-grid">
            {HOME_STATS_CONFIG.map((stat, index) => (
                <StatBox
                    key={index}
                    label={stat.label}
                    value={overviewStats[stat.key as keyof typeof overviewStats]}
                    icon={stat.icon}
                    color={stat.color}
                    bgColor={stat.bgColor}
                    onClick={() => navigate(stat.route)}
                />
            ))}
        </div>
    );
};
