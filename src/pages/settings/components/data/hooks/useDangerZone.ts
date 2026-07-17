import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { logger } from '../../../../../utility/logger';
import type { ResetActionConfig } from '../../../actions/getResetActions';

export const useDangerZone = () => {
    const [activeModalId, setActiveModalId] = useState<string | null>(null);
    const [resettingId, setResettingId] = useState<string | null>(null);

    const isAnyResetting = resettingId !== null;

    const executeReset = async (config: ResetActionConfig) => {
        setActiveModalId(null);
        setResettingId(config.id);
        try {
            logger.info(`requesting ${config.loggerPrefix} reset`); 
            await invoke(config.command);
            alert(config.successMessage);
        } catch (err) {
            logger.error(`${config.errorMessagePrefix}: ${String(err)}`);
            alert(`${config.errorMessagePrefix}: ${String(err)}`);
        } finally {
            setResettingId(null);
        }
    };

    return {
        activeModalId,
        setActiveModalId,
        resettingId,
        isAnyResetting,
        executeReset
    };
};
