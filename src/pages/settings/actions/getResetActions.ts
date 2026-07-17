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
        },
        {
            id: 'projects',
            buttonLabel: 'Reset Projects Only',
            resettingLabel: 'Resetting...',
            buttonClass: 'settings-button-amber',
            command: CMD_RESET_PROJECT_TABLE,
            modalTitle: 'Reset Projects Table',
            modalMessage: 'Are you sure you want to reset the projects table? This will erase all project metadata like pin states and statuses. This cannot be undone.',
            confirmText: 'Yes, reset projects',
            successMessage: 'Project table has been successfully reset. Please restart the app or refresh pages to see changes.',
            errorMessagePrefix: 'Failed to reset project table',
            loggerPrefix: 'project table'
        },
        {
            id: 'shows',
            buttonLabel: 'Reset Shows Only',
            resettingLabel: 'Resetting...',
            buttonClass: 'settings-button-blue',
            command: CMD_RESET_SHOWS_TABLE,
            modalTitle: 'Reset Shows Table',
            modalMessage: 'Are you sure you want to reset the shows table? This will erase all show metadata like pin states and ban statuses. This cannot be undone.',
            confirmText: 'Yes, reset shows',
            successMessage: 'Shows table has been successfully reset. Please restart the app or refresh pages to see changes.',
            errorMessagePrefix: 'Failed to reset shows table',
            loggerPrefix: 'shows table'
        },
        {
            id: 'media',
            buttonLabel: 'Reset Media Cache Only',
            resettingLabel: 'Resetting...',
            buttonClass: 'settings-button-green',
            command: CMD_RESET_MEDIA_CACHE_TABLE,
            modalTitle: 'Reset Media Table',
            modalMessage: 'Are you sure you want to reset the media_cache table? This will erase all media metadata like pin states and ban statuses. This cannot be undone.',
            confirmText: 'Yes, reset Media',
            successMessage: 'Media cache table has been successfully reset. Please restart the app or refresh pages to see changes.',
            errorMessagePrefix: 'Failed to reset media_cache table',
            loggerPrefix: 'media_cache table'
        }
    ];
};
