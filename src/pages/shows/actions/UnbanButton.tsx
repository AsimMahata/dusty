import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { logger } from '../../../utility/logger';
import type { ItemData } from '../../../types/types';

interface UnbanButtonProps {
    item: ItemData;
    onComplete: (item: ItemData) => void;
}

export const UnbanButton: React.FC<UnbanButtonProps> = ({ item, onComplete }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isConfirming) {
            timeout = setTimeout(() => setIsConfirming(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isConfirming]);

    const handleClick = async () => {
        if (isConfirming) {
            try {
                logger.info('requested unban for', { id: item.id, title: item.title });
                await invoke("unban_show", { showId: item.id });
                onComplete(item);
            } catch (error) {
                logger.error(`Failed to unban show: ${String(error)}`);
            }
        } else {
            setIsConfirming(true);
        }
    };

    let bg = '#16a34a'; // default green
    if (isConfirming) bg = '#14532d'; // darker green
    else if (isHovered) bg = '#15803d'; // hover green

    return (
        <button
            style={{
                padding: '0.4rem 1rem',
                backgroundColor: bg,
                color: 'white',
                border: isConfirming ? '1px solid #4ade80' : '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: isConfirming ? '120px' : '80px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isConfirming ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isConfirming ? '0 0 15px rgba(22, 163, 74, 0.6)' : 'none',
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConfirming ? 'Are you sure?' : 'Unban'}
        </button>
    );
};
