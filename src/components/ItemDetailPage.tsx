import React from 'react';
import { ArrowLeft, PlayCircle, FileText } from 'lucide-react';

export interface ItemData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  metadata?: string;
  size?: string;
}

interface ItemDetailPageProps {
  item: ItemData;
  onBack: () => void;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ item, onBack }) => {
  // Generate some mock children items based on the parent item to simulate a list of episodes/files
  const generateMockChildren = () => {
    const isVideo = item.title.toLowerCase().includes('season') || item.metadata?.includes('Episodes');
    const count = isVideo ? 12 : 8;
    
    return Array.from({ length: count }).map((_, i) => ({
      id: `${item.id}-child-${i}`,
      title: isVideo ? `Episode ${i + 1}` : `File_${i + 1}_final_v2`,
      subtitle: isVideo ? `The One With The Detail ${i + 1}` : 'Modified 2 days ago',
      size: isVideo ? '450 MB' : '2.4 MB',
      icon: isVideo ? <PlayCircle size={18} /> : <FileText size={18} />
    }));
  };

  const children = generateMockChildren();

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
        {children.map((child) => (
          <div key={child.id} className="list-item">
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
