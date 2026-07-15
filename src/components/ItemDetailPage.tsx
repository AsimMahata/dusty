import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { DEFAULT_ICON } from '../utility/defaults';

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    metadata?: string;
    size?: string;
    path?: string;
    is_dir?: boolean;
}

interface ItemDetailPageProps {
    item: ItemData;
    getChildrens?: (item: ItemData) => Promise<ItemData[]>;
    onBack: () => void;
    onClick?: (child: ItemData) => Promise<void>;
    renderActions?: (item: ItemData) => React.ReactNode;
    defaultIcon?: React.ReactNode;
    onRename?: (item: ItemData, newTitle: string) => Promise<void>;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
    item,
    getChildrens,
    onBack,
    onClick,
    renderActions,
    defaultIcon,
    onRename,
}) => {
    const [childrens, setChildrens] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    const handleEditClick = () => {
        setEditValue(item.title);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleConfirmEdit = async () => {
        if (!editValue || editValue === item.title) {
            setIsEditing(false);
            return;
        }

        if (onRename) {
            setIsRenaming(true);
            try {
                await onRename(item, editValue);
            } finally {
                setIsRenaming(false);
                setIsEditing(false);
            }
        }
    };

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            const data = getChildrens ? await getChildrens(item) : [];
            if (!cancelled) {
                setChildrens(data);
                setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [item, getChildrens]);

    return (
        <div className="detail-page">
            <div className="detail-header">
                <button className="back-btn" onClick={onBack} title="Go back">
                    <ArrowLeft size={20} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input 
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                style={{
                                    background: 'var(--bg-secondary, #2a2a2a)',
                                    color: 'white',
                                    border: '1px solid var(--border-color, #444)',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    outline: 'none',
                                    width: '100%',
                                    maxWidth: '600px'
                                }}
                                disabled={isRenaming}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirmEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                }}
                            />
                            <button onClick={handleConfirmEdit} disabled={isRenaming} style={{ background: 'transparent', border: 'none', color: '#4ade80', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}>
                                <Check size={20} />
                            </button>
                            <button onClick={handleCancelEdit} disabled={isRenaming} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}>
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="detail-title">{item.title}</div>
                            {onRename && (
                                <button 
                                    onClick={handleEditClick}
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
                    )}
                    <div className="detail-subtitle">
                        {item.subtitle} {item.metadata && `• ${item.metadata}`}
                    </div>
                </div>
                {!loading && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                        {childrens.length}
                    </span>
                )}
            </div>

            {renderActions && (
                <div className="detail-actions" style={{ padding: '0 1.5rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {renderActions(item)}
                </div>
            )}

            <div className="list-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    childrens.map((child) => (
                        <div
                            key={child.id}
                            className="list-item"
                            onClick={() => onClick && onClick(child)}
                        >
                            <div className="list-item-icon">
                                {child.icon || defaultIcon || DEFAULT_ICON}
                            </div>

                            <div className="list-item-content">
                                <div className="list-item-title">{child.title}</div>
                                <div className="list-item-subtitle">{child.subtitle}</div>
                            </div>

                            <div className="list-item-meta">
                                {child.size}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
