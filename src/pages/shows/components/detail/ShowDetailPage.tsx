import React, { useEffect, useState } from 'react';
import { getChildrens } from '../../actions/utility';
import { ShowDetailHero } from './ShowDetailHero';
import { ShowEpisodesList } from './ShowEpisodesList';
import './../../css/ShowDetailPage.css';
import type { useShow } from '../../hooks/useShow';
import type { Episode } from "../../../../components/media/types/types";

interface ShowDetailPageProps {
    showHook: ReturnType<typeof useShow>
}

export const ShowDetailPage: React.FC<ShowDetailPageProps> = ({ showHook }) => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const show = showHook.selectedShow;
    if (!show) return <div>No Show Selected</div>;

    const onBack = () => {
        showHook.setSelectedShow(null);
    };

    useEffect(() => {
        const loadEpisodes = async () => {
            const itemCollection = { id: show.id, title: show.title, subtitle: '', is_dir: true };
            const eps = await getChildrens(itemCollection, showHook.allShows);
            setEpisodes(eps);
        };
        loadEpisodes();
    }, [show]);

    return (
        <div className="show-detail-page">
            <ShowDetailHero show={show} getActionsForShow={showHook.getActionsForShow} onBack={onBack} />
            <ShowEpisodesList episodes={episodes} onEpisodeClick={showHook.openEpisode} />
        </div>
    );
};

