import React, { useState, useEffect } from 'react';
import { SCROLL_TOP_ICON_24 } from '../../constants/icon';


interface FloatingScrollTopProps {
    scrollContainerSelector?: string;
    threshold?: number;
}

export const FloatingScrollTop: React.FC<FloatingScrollTopProps> = ({ 
    scrollContainerSelector = '.main-content', 
    threshold = 300 
}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.scrollTop > threshold) {
                setShow(true);
            } else {
                setShow(false);
            }
        };

        const scrollContainer = document.querySelector(scrollContainerSelector);
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, [scrollContainerSelector, threshold]);

    const scrollToTop = () => {
        const scrollContainer = document.querySelector(scrollContainerSelector);
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!show) return null;

    return (
        <button 
            className="floating-scroll-top"
            onClick={scrollToTop}
            title="Scroll to Top"
        >
            {SCROLL_TOP_ICON_24}
        </button>
    );
};
