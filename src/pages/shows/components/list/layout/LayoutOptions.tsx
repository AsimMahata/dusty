import React from 'react';
import { List, Grid } from 'lucide-react';

interface LayoutOptionsProps {
    isGridLayout: boolean;
    setIsGridLayout: (isGrid: boolean) => void;
}

export const LayoutOptions: React.FC<LayoutOptionsProps> = ({ isGridLayout, setIsGridLayout }) => {
    return (
        <div className="show-layout-toggles">
            <div 
                className={`show-layout-toggle ${!isGridLayout ? 'active' : ''}`}
                onClick={() => setIsGridLayout(false)}
            >
                <List size={16} />
            </div>
            <div 
                className={`show-layout-toggle ${isGridLayout ? 'active' : ''}`}
                onClick={() => setIsGridLayout(true)}
            >
                <Grid size={16} />
            </div>
        </div>
    );
};
