import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Settings, ListTodo } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useDusty } from '../../contexts/DustyContext';

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { profile, systemStatus } = useDusty();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="home-header">
      <div className="home-header-top">
        <div className="home-greeting">
          <img src={profile.avatar} alt="Avatar" className="home-avatar" />
          Good Evening, {profile.name}.
        </div>
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
      </div>
      
      <div className="home-header-main">
        <div className="home-time">{formatTime(time)}</div>
        <div className="home-quote">
          <span className="quote-mark">“</span> {systemStatus}
        </div>
      </div>
    </div>
  );
};
