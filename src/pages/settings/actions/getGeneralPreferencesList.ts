import type { SettingItemProps } from '../components/general/SettingItem';

export const getGeneralPreferencesList = (
    settings: { theme: string; showHiddenFiles: boolean; [key: string]: any }, 
    updateSettings: (s: any) => void
): SettingItemProps[] => {
    return [
        {
            id: 'theme',
            title: 'Theme',
            desc: 'Choose your preferred color scheme.',
            type: 'select',
            value: settings.theme,
            onChange: (v: string) => updateSettings({ theme: v as 'dark' | 'light' }),
            options: [
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' }
            ]
        },
        {
            id: 'hidden-files',
            title: 'Show Hidden Files',
            desc: 'Display files and folders that start with a dot.',
            type: 'checkbox',
            value: settings.showHiddenFiles,
            onChange: (v: boolean) => updateSettings({ showHiddenFiles: v })
        }
    ];
};
