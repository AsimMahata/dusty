import type { SettingItemProps } from "../../../types/settings";
import { addSeasonalAnime } from "../../../personalities/introverts/show/anime";

export const getGeneralPreferencesList = (): SettingItemProps[] => {
    return [
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
