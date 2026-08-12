import React, { useState } from 'react';
import type { UserPageHook } from '../../hooks/useUserPage';
import { MONITOR_ICON_18 } from '../../../../constants/icon';
import { Eye, EyeOff } from 'lucide-react';

interface DeviceInfoSectionProps {
  hook: UserPageHook;
}

export const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({ hook }) => {
  const { deviceInfo } = hook;
  const [showIp, setShowIp] = useState(false);

  const rawIp = deviceInfo?.local_ip;

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
          <span className="details-value">{deviceInfo?.arch || 'Unknown'}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Local IP</span>
          <div className="details-value-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="details-value details-value-muted">
              {!rawIp ? 'Unavailable' : showIp ? rawIp : '••••••••'}
            </span>
            {rawIp && (
              <button
                type="button"
                onClick={() => setShowIp(!showIp)}
                title={showIp ? "Hide Local IP" : "Show Local IP"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                {showIp ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
