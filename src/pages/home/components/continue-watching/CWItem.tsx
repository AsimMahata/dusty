import React, { useEffect, useState } from 'react';
import { Play, MoreVertical } from 'lucide-react';
import type { RecentEpisode } from './ContinueWatching';
import { getShowMetaData } from '../../../../introverts/show/mal';
import type { ShowMetaData } from '../../../shows/constants/constants';
import { logger } from '../../../../utility/logger';
import { RecentEpisodeTitle, RecentEpisodeSubtitle } from '../../../../components/ui/RecentEpisodeText';


interface CWItemProps {
  item: RecentEpisode;
}

export const CWItem: React.FC<CWItemProps> = ({ item }) => {
  const [meta,setMeta] = useState<ShowMetaData | null>(null);
  useEffect(() =>{
    const getMetaData = async() =>{
    try{
      const meta:ShowMetaData = await getShowMetaData(item.show);
      setMeta(meta);
      logger.info("Show meta data", meta);
    }catch(err){
      logger.error("Failed to get show meta data", err);
    }
  }
    getMetaData();
  },[item.show.mal_id]);
  return (
    <div className="cw-item">
      <div className="cw-image-container">
        <img src={meta?.posterUrl} alt={item.show.title} className="cw-image" />
        <div className="cw-play-overlay">
          <Play size={20} fill="currentColor" />
        </div>
        <div className="cw-progress-bar">
          <div className="cw-progress-fill" style={{ width: `${meta?.progress || 0}%` }}></div>
        </div>
      </div>
      <div className="cw-info">
        <div className="cw-text">
          <RecentEpisodeTitle className="cw-title" title={item.episode.title} />
          <RecentEpisodeSubtitle className="cw-subtitle" title={item?.show?.title || ""} />
        </div>
        <button className="cw-menu-btn"><MoreVertical size={16} /></button>
      </div>
    </div>
  );
};
