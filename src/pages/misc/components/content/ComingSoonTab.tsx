import React from 'react';
import { TITLE_COMING_SOON } from '../../constants/constants';
import '../../css/Misc.css';

export const ComingSoonTab: React.FC = () => {
    return (
        <div className="misc-coming-soon">
            <h2>{TITLE_COMING_SOON}...</h2>
        </div>
    );
};
