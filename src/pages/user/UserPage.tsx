import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useUserPage } from './hooks/useUserPage';
import { ProfileHero } from './components/hero/ProfileHero';
import { DeviceInfoSection } from './components/details/DeviceInfoSection';
import { UserPreferences } from './components/preferences/UserPreferences';
import { EditProfileDialog } from './components/dialogs/EditProfileDialog';
import './css/User.css';

export const UserPage: React.FC = () => {
  const userPage = useUserPage();

  return (
    <PageLayout title="User Profile" hideSearch showCloseButton>
      <div className="user-profile-container">
        
        {/* 1. Hero Section */}
        <ProfileHero hook={userPage} />

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* 2. Device Information */}
          <DeviceInfoSection hook={userPage} />

          {/* 3. Preferences */}
          <UserPreferences hook={userPage} />

        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileDialog hook={userPage} />
    </PageLayout>
  );
};

