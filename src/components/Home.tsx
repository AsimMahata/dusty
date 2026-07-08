import React from 'react';
import { HardDrive, FolderSearch, Trash2 } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const Home: React.FC = () => {
  return (
    <PageLayout title="Home" hideSearch>
      <div className="home-container">
        <div className="home-logo">
          <img src="/icon.png" alt="Dusty Logo" />
        </div>
        <h1 className="home-title">Welcome to Dusty</h1>
        <p className="home-desc">
          Your filesystem intelligence engine. Dusty scans your drives to figure out what's actually in them — grouping scattered TV shows, surfacing old projects, and helping you clean up forgotten files.
        </p>
        
        <div className="home-stats">
          <div className="stat-card">
            <HardDrive size={24} className="brand-icon" />
            <div className="stat-value">1.2 TB</div>
            <div className="stat-label">Scanned</div>
          </div>
          <div className="stat-card">
            <FolderSearch size={24} className="brand-icon" />
            <div className="stat-value">34</div>
            <div className="stat-label">Projects Found</div>
          </div>
          <div className="stat-card">
            <Trash2 size={24} className="brand-icon" />
            <div className="stat-value">45 GB</div>
            <div className="stat-label">Space Saved</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
