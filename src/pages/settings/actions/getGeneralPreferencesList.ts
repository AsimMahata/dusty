import type { SettingItemProps } from "../types/types";
import { addSeasonalShows } from "../../../personalities/introverts/show/search";

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
                    const success = await addSeasonalShows();
                    return success;
                } catch (e) {
                    console.error('Failed to invoke addSeasonalAnime', e);
                    return false;
                }
            }
        }
    ];
};
