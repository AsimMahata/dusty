import React from 'react';

export interface SettingItemProps {
    id?: string;
    title: string;
    desc: string;
    type: 'select' | 'checkbox';
    value: any;
    onChange: (val: any) => void;
    options?: { value: string; label: string }[];
}

export const SettingItem: React.FC<SettingItemProps> = ({ title, desc, type, value, onChange, options }) => {
    return (
        <div className="settings-item-container">
            <div>
                <h4 className="settings-item-title">{title}</h4>
                <p className="settings-item-desc">{desc}</p>
            </div>
            {type === 'select' && options ? (
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="settings-select"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : type === 'checkbox' ? (
                <input 
                    type="checkbox" 
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="settings-checkbox"
                />
            ) : null}
        </div>
    );
};
