import React, { useState } from 'react';
import type { SettingItemProps } from "../../types/types";
export const SettingItem: React.FC<SettingItemProps> = ({ title, desc, type, value, onChange, onClick, buttonText, buttonClass, options }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleButtonClick = async () => {
        if (!onClick) return;
        setStatus('loading');
        try {
            const result = await onClick();
            if (result === false) {
                setStatus('error');
            } else {
                setStatus('success');
            }
        } catch (e) {
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };
    return (
        <div className="settings-item-container">
            <div>
                <h4 className="settings-item-title">{title}</h4>
                <p className="settings-item-desc">{desc}</p>
            </div>
            {type === 'select' && options && onChange ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="settings-select"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : type === 'checkbox' && onChange ? (
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="settings-checkbox"
                />
            ) : type === 'button' && onClick ? (
                <div className="settings-button-wrapper">
                    <button
                        onClick={handleButtonClick}
                        disabled={status === 'loading'}
                        className={`settings-button ${buttonClass || 'settings-button-blue'}`}
                    >
                        {status === 'loading' ? 'Processing...' : buttonText || 'Click Here'}
                    </button>
                    {status === 'success' && <span className="settings-feedback-success">Success</span>}
                    {status === 'error' && <span className="settings-feedback-error">Failed</span>}
                </div>
            ) : null}
        </div>
    );
};
