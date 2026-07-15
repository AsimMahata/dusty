import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DustyContextType {
    lastOpenedPage: string;
    setLastOpenedPage: (path: string) => void;
}

const DustyContext = createContext<DustyContextType | undefined>(undefined);

export const DustyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastOpenedPage, setLastOpenedPage] = useState<string>('/');

    return (
        <DustyContext.Provider value={{ lastOpenedPage, setLastOpenedPage }}>
            {children}
        </DustyContext.Provider>
    );
};

export const useDusty = () => {
    const context = useContext(DustyContext);
    if (!context) {
        throw new Error("useDusty must be used within a DustyProvider");
    }
    return context;
};


export const RouteTracker: React.FC = () => {
    const location = useLocation();
    const { setLastOpenedPage } = useDusty();

    useEffect(() => {
        if (location.pathname !== '/settings' && location.pathname !== '/lab') {
            setLastOpenedPage(location.pathname);
        }
    }, [location.pathname, setLastOpenedPage]);

    return null;
};
