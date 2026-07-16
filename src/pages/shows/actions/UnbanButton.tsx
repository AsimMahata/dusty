import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_UNBAN_SHOW } from '../../../constants/commands';
import { COLOR_UNBAN_BG, COLOR_UNBAN_CONFIRM_BG, COLOR_UNBAN_HOVER_BG, COLOR_UNBAN_CONFIRM_BORDER, COLOR_UNBAN_SHADOW } from '../../../constants/color';
import { getActionButtonStyle } from '../../../styles/buttonStyles';
import { logger } from '../../../utility/logger';
import type { ItemCollection } from '../../../types/types';

interface UnbanButtonProps {
    item: ItemCollection;
    onComplete: (item: ItemCollection) => void;
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
                await invoke(CMD_UNBAN_SHOW, { showId: item.id });
                onComplete(item);
            } catch (error) {
                logger.error(`Failed to unban show: ${String(error)}`);
            }
        } else {
            setIsConfirming(true);
        }
    };

    let bg = COLOR_UNBAN_BG; // default green
    if (isConfirming) bg = COLOR_UNBAN_CONFIRM_BG; // darker green
    else if (isHovered) bg = COLOR_UNBAN_HOVER_BG; // hover green

    return (
        <button
            style={getActionButtonStyle(bg, isConfirming, COLOR_UNBAN_CONFIRM_BORDER, COLOR_UNBAN_SHADOW)}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConfirming ? 'Are you sure?' : 'Unban'}
        </button>
    );
};
