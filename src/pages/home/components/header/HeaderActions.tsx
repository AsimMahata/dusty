import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME_HEADER_ACTIONS } from '../../constants/constants';

export const HeaderActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-header-actions">
            {HOME_HEADER_ACTIONS.map((action, index) => {
                const Icon = action.icon;
                return (
                    <button key={index} className="home-action-btn" onClick={() => navigate(action.route)}>
                        <Icon size={16} /> {action.label}
                    </button>
                );
            })}
        </div>
    );
};
