import type { SettingItemProps } from "../../../types/settings";
import { addSeasonalAnime } from "../../../personalities/introverts/show/anime";

export const getGeneralPreferencesList = (
    settings: { theme: string; showHiddenFiles: boolean;[key: string]: any },
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
        },
        {
            id: 'add-seasonal-anime',
            title: 'Add Seasonal Anime',
            desc: 'Fetch and add the latest seasonal anime to your library.',
            type: 'button',
            buttonText: 'Add Anime',
            buttonClass: 'settings-button-blue',
            onClick: async () => {
                try {
                    const success = await addSeasonalAnime();
                    return success;
                } catch (e) {
                    console.error('Failed to invoke addSeasonalAnime', e);
                    return false;
                }
            }
        }
    ];
};
