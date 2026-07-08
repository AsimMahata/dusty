import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    metadata?: string;
    size?: string;
    path?: string,
}

interface ItemDetailPageProps {
    item: ItemData;
    childrens: ItemData[],
    onBack: () => void;
    onClick: (child: ItemData) => Promise<void>
}


export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, childrens: childrens, onBack, onClick }) => {
    return (
        <div className="detail-page">
            <div className="detail-header">
                <button className="back-btn" onClick={onBack} title="Go back">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="detail-title">{item.title}</div>
                    <div className="detail-subtitle">{item.subtitle} {item.metadata && `• ${item.metadata}`}</div>
                </div>
            </div>

            <div className="list-container">
                {childrens.map((child: ItemData) => (
                    <div key={child.id} className="list-item"
                        onClick={() => onClick(child)}
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
                ))}
            </div>
        </div>
    );
};
