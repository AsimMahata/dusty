import { CMD_RESET_DATABASE } from '../../../constants/commands';
import type { ResetActionConfig } from "../../../types/settings";
export const getResetActions = (): ResetActionConfig[] => {
    return [
        {
            id: 'all',
            buttonLabel: 'Reset All Data',
            resettingLabel: 'Resetting...',
            buttonClass: 'settings-button-red',
            command: CMD_RESET_DATABASE,
            modalTitle: 'Reset Database',
            modalMessage: 'Are you absolutely sure you want to reset the database? This will erase all shows, bans, and saved metadata. This cannot be undone.',
            confirmText: 'Yes, reset all data',
            successMessage: 'Database has been successfully reset. Please restart the app or refresh pages to see changes.',
            errorMessagePrefix: 'Failed to reset database',
            loggerPrefix: 'database'
        }
    ];
};
