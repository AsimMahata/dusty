import React from 'react';
import { TITLE_COMING_SOON } from '../../../../constants/tabs';
import { getComingSoonStyle } from '../../styles/miscStyles';

export const ComingSoonTab: React.FC = () => {
    return (
        <div style={getComingSoonStyle()}>
            <h2>{TITLE_COMING_SOON}...</h2>
        </div>
    );
};
