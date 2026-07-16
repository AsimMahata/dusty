import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_BAN_SHOW } from '../../../constants/commands';
import { COLOR_BAN_BG, COLOR_BAN_CONFIRM_BG, COLOR_BAN_HOVER_BG, COLOR_BAN_CONFIRM_BORDER, COLOR_BAN_SHADOW } from '../../../constants/color';
import { getActionButtonStyle } from '../../../styles/buttonStyles';
import { logger } from '../../../utility/logger';
import type { ItemCollection } from '../../../types/types';

interface BanButtonProps {
    item: ItemCollection;
    onComplete: (item: ItemCollection) => void;
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
                await invoke(CMD_BAN_SHOW, { showId: item.id });
                onComplete(item);
            } catch (error) {
                logger.error(`Failed to ban show: ${String(error)}`);
            }
        } else {
            setIsConfirming(true);
        }
    };

    let bg = COLOR_BAN_BG;
    if (isConfirming) bg = COLOR_BAN_CONFIRM_BG;
    else if (isHovered) bg = COLOR_BAN_HOVER_BG;

    return (
        <button
            style={getActionButtonStyle(bg, isConfirming, COLOR_BAN_CONFIRM_BORDER, COLOR_BAN_SHADOW)}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConfirming ? 'Are you sure?' : 'Ban'}
        </button>
    );
};
