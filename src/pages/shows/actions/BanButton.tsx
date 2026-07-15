import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { logger } from '../../../utility/logger';
import type { ItemData } from '../../../components/ItemDetailPage';

interface BanButtonProps {
    item: ItemData;
    onComplete: (item: ItemData) => void;
}

export const BanButton: React.FC<BanButtonProps> = ({ item, onComplete }) => {
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
                logger.info('requested ban for', { showId: item.id });
                await invoke("ban_show", { showId: item.id });
                onComplete(item);
            } catch (error) {
                logger.error(`Failed to ban show: ${String(error)}`);
            }
        } else {
            setIsConfirming(true);
        }
    };

    let bg = '#dc2626';
    if (isConfirming) bg = '#991b1b';
    else if (isHovered) bg = '#b91c1c';

    return (
        <button
            style={{
                padding: '0.4rem 1rem',
                backgroundColor: bg,
                color: 'white',
                border: isConfirming ? '1px solid #f87171' : '1px solid transparent',
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
                boxShadow: isConfirming ? '0 0 15px rgba(220, 38, 38, 0.6)' : 'none',
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConfirming ? 'Are you sure?' : 'Ban'}
        </button>
    );
};
