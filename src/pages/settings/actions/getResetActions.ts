import { CMD_RESET_DATABASE, CMD_RESET_MEDIA_CACHE_TABLE, CMD_RESET_PROJECT_TABLE, CMD_RESET_SHOWS_TABLE } from '../../../constants/commands';

export interface ResetActionConfig {
    id: string;
    buttonLabel: string;
    resettingLabel: string;
    buttonClass: string;
    command: string;
    modalTitle: string;
    modalMessage: string;
    confirmText: string;
    successMessage: string;
    errorMessagePrefix: string;
    loggerPrefix: string;
}

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
