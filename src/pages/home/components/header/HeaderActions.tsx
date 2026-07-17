import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Settings, ListTodo } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';

export const HeaderActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-header-actions">
      <button className="home-action-btn" onClick={() => navigate(ROUTES.LAB)}>
        <FlaskConical size={16} /> Experiment
      </button>
      <button className="home-action-btn" onClick={() => navigate(ROUTES.TODO)}>
        <ListTodo size={16} /> Todo
      </button>
      <button className="home-action-btn" onClick={() => navigate(ROUTES.SETTINGS)}>
        <Settings size={16} /> Settings
      </button>
    </div>
  );
};
