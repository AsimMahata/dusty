import { useState } from 'react';
import { logger } from '../../../../../utility/logger';
import toast from 'react-hot-toast';
import type { ResetActionConfig } from "../../../../../types/settings";

export const useDangerZone = () => {
    const [activeModalId, setActiveModalId] = useState<string | null>(null);
    const [resettingId, setResettingId] = useState<string | null>(null);

    const isAnyResetting = resettingId !== null;

    const executeReset = async (config: ResetActionConfig) => {
        setActiveModalId(null);
        setResettingId(config.id);
        try {
            logger.info(`requesting ${config.loggerPrefix} reset`); 
            await config.action();
            toast.success(config.successMessage);
        } catch (err) {
            logger.error(`${config.errorMessagePrefix}: ${String(err)}`);
            toast.error(`${config.errorMessagePrefix}: ${String(err)}`);
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
