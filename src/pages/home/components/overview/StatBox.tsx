import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatBoxProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  onClick: () => void;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, icon: Icon, color, bgColor, onClick }) => {
  return (
    <div className="stat-box" onClick={onClick}>
      <div className="stat-icon-wrapper" style={{ color, background: bgColor }}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};
