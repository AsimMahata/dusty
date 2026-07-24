import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';

export const CWHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-card-header">
            <span className="home-card-title">Continue Watching</span>
            <button className="view-all-btn" onClick={() => navigate(ROUTES.SHOWS)}>
                View All <ArrowRight size={16} />
            </button>
        </div>
    );
};
