import React from 'react';

interface ShowProgressProps {
    progress: number;
    statusColor: string;
}

export const ShowProgress: React.FC<ShowProgressProps> = ({ progress, statusColor }) => {
    return (
        <div className="show-grid-progress-bar-container">
            <div 
                className="show-grid-progress-bar" 
                style={{ 
                    width: `${progress}%`, 
                    backgroundColor: statusColor 
                }} 
            />
        </div>
    );
};
