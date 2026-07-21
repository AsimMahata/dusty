import React, { useEffect, useState } from 'react';
import { CWHeader } from './CWHeader';
import { CWItem } from './CWItem';
import type { Episode, ShowResult } from '../../../../types/types';
import { logger } from '../../../../utility/logger';
import { getRecentViewedEpisodes } from '../../../../introverts/home/recentEp';

export interface RecentEpisode {
  show:ShowResult;
  episode:Episode;
}

export const ContinueWatching: React.FC = () => {
  const [recentVideos,setRecentVideos] = useState<RecentEpisode[]>([]);
  useEffect(() =>{
    const getVideos = async()=>{
      try{
      const recent:RecentEpisode[] =await getRecentViewedEpisodes();
      setRecentVideos(recent);
    }catch(err){
      logger.error("Failed to get recent view videos", err);
    }}
    getVideos();
  },[])
  
  if (recentVideos.length === 0){
    return <></>
  }
  return (
    <div className="home-card continue-watching-card">
      <CWHeader />
      <div className="cw-grid">
        {recentVideos.slice(0,3).map(item => (
          <CWItem key={item.episode.id} item={item} />
        ))}
      </div>
    </div>
  );
};
