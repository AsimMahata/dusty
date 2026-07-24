import React from 'react';
import { Greeting } from './Greeting';
import { HeaderActions } from './HeaderActions';
import { Clock } from './Clock';
import { Quote } from './Quote';

export const HomeHeader: React.FC = () => {

    return (
        <div className="home-header">
            <div className="home-header-top">
                <Greeting />
                <HeaderActions />
            </div>

            <div className="home-header-main">
                <Clock />
                <Quote />
            </div>
        </div>
    );
};
