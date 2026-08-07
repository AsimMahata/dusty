import React from 'react';
import type { UserPageHook } from '../../hooks/useUserPage';
import { MONITOR_ICON_18 } from '../../../../constants/icon';


interface DeviceInfoSectionProps {
  hook: UserPageHook;
}

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ hook }) => {
  const { deviceInfo } = hook;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        {React.cloneElement(MONITOR_ICON_18, { className: 'card-header-icon' })}
        <h3>Device Information</h3>
      </div>
      <div className="details-list">
        <div className="details-row">
          <span className="details-label">Computer Name</span>
          <span className="details-value">{deviceInfo?.device_name || 'Unknown'}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Hostname</span>
          <span className="details-value">{deviceInfo?.hostname || 'Unknown'}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Operating System</span>
          <span className="details-value">{deviceInfo?.os || 'Unknown'}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Architecture</span>
          <span className="details-value">x86_64 (64-bit)</span>
        </div>
        <div className="details-row">
          <span className="details-label">Local IP</span>
          <span className="details-value details-value-muted">192.168.1.42</span>
        </div>
      </div>
    </div>
  );
};
