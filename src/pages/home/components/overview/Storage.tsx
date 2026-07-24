import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';
import { STORAGE_COLOR_THRESHOLDS, STORAGE_DEFAULT_COLOR } from '../../constants/constants';

export const Storage: React.FC = () => {
    const { storageInfo } = useHomeContext();

    const usedPercent = storageInfo.segments.reduce((acc, segment) => acc + segment.percent, 0);
    const freePercent = 100 - usedPercent;

    const matchedColor = STORAGE_COLOR_THRESHOLDS.find(t => freePercent < t.maxPercent);
    const freeColor = matchedColor ? matchedColor.color : STORAGE_DEFAULT_COLOR;

    return (
        <div className="home-card storage-card">
            <div className="home-card-header">
                <span className="home-card-title">Storage</span>
            </div>
            <div className="storage-content">
                <div className="storage-progress-bar">
                    {storageInfo.segments.map((segment, index) => (
                        <div key={index} className={`storage-segment ${segment.color}`} style={{ width: `${segment.percent}%` }}></div>
                    ))}
                </div>
                <div className="storage-labels">
                    <span className="storage-used"><strong>{storageInfo.used}</strong> / {storageInfo.total} Used</span>
                    <span className="storage-free" style={{ color: freeColor }}>{storageInfo.free} Free</span>
                </div>
            </div>
        </div>
    );
};
