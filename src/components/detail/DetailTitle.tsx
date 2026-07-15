import React from 'react';
import { Edit2 } from 'lucide-react';

interface DetailTitleProps {
    title: string;
    onEditClick?: () => void;
    canRename?: boolean;
    color?: string;
}

export const DetailTitle: React.FC<DetailTitleProps> = ({
    title,
    onEditClick,
    canRename,
    color
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="detail-title" style={color ? { color } : undefined}>{title}</div>
            {canRename && (
                <button
                    onClick={onEditClick}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.5,
                        transition: 'opacity 0.2s, color 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    title="Rename"
                >
                    <Edit2 size={16} />
                </button>
            )}
        </div>
    );
};
