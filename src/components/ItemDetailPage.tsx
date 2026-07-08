import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
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
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
    item,
    getChildrens,
    onBack,
    onClick,
}) => {
    const [childrens, setChildrens] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState(true);

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
                <div>
                    <div className="detail-title">{item.title}</div>
                    <div className="detail-subtitle">
                        {item.subtitle} {item.metadata && `• ${item.metadata}`}
                    </div>
                </div>
            </div>

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
                                {child.icon}
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
