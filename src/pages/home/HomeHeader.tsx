import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Settings } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const getStatus = () => {
  const statuses = [
    "Filesystem is up to date.",
    "Last scan completed successfully.",
    "Everything looks good.",
    "Last scan completed 12 minutes ago.",
    "Ready."
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return { text: "Good Morning, Asim.", icon: "🌅" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon, Asim.", icon: "☀️" };
    if (hour >= 17 && hour < 21) return { text: "Good Evening, Asim.", icon: "🌆" };
    return { text: "Good Night, Asim.", icon: "🌙" };
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  };

  const getDayAndMonth = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const greeting = getGreeting();

  return (
    <div className="home-header">
      <div className="home-header-top">
        <div className="home-greeting">
          {greeting.icon} {greeting.text}
        </div>
        <div className="home-header-actions">
          <button className="home-action-btn" onClick={() => navigate(ROUTES.LAB)} title="Lab / Experiment Zone">
            <FlaskConical size={20} />
          </button>
          <button className="home-action-btn" onClick={() => navigate(ROUTES.SETTINGS)} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      <div className="home-header-main">
        <div className="home-time">{formatTime(time)}</div>
        <div className="home-quote">{getStatus()}</div>
      </div>
    </div>
  );
};
