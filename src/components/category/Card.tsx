import React from 'react';
import { Pin } from 'lucide-react';

interface CardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    metadata?: string;
    size?: string;
    isSelected?: boolean;
    onClick?: () => void;
    isPinned?: boolean;
    onTogglePin?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon, metadata, size, isSelected, onClick, isPinned, onTogglePin }) => {
    return (
        <div
            className={`item-card ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            {onTogglePin && (
                <button
                    onClick={onTogglePin}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: isPinned ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isPinned ? 1 : 0.5,
                        transition: 'all 0.2s'
                    }}
                    title={isPinned ? "Unpin" : "Pin"}
                >
                    {isPinned ? <Pin size={16} fill="currentColor" /> : <Pin size={16} />}
                </button>
            )}
            <div className="card-icon-wrap">
                {icon}
            </div>
            <div className="card-content">
                <div className="card-title">{title}</div>
                <div className="card-subtitle">{subtitle}</div>
                {(metadata || size) && (
                    <div className="card-meta">
                        {metadata && (
                            <span className="meta-item">
                                <span>•</span> {metadata}
                            </span>
                        )}
                        {size && (
                            <span className="meta-item">
                                <span>•</span> {size}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
