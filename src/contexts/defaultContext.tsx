import React, { createContext, useContext, type ReactNode } from 'react';
import { File, PlayCircle, Folder, Tv, FileCode2 } from "lucide-react";

interface DefualtContextType {
    DEFAULT_STARTING_PATH: string,
    DEFAULT_ICON: ReactNode,
    DEFAULT_SHOW_ICON: ReactNode,
    DEFAULT_FOLDER_ICON: ReactNode,
    DEFAULT_FILE_ICON: ReactNode,
    DEFAULT_TV_ICON: ReactNode,
    DEFAULT_PROJECT_ICON: ReactNode,
}


const DefaultContext = createContext<DefualtContextType | undefined>(undefined);

export const DefaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const DEFAULT_ICON = <File size={18} />;
    const DEFAULT_SHOW_ICON = <PlayCircle size={18} />;
    const DEFAULT_STARTING_PATH = "C:\\";
    const DEFAULT_FOLDER_ICON = <Folder size={18} />;
    const DEFAULT_FILE_ICON = <File size={18} />;
    const DEFAULT_TV_ICON = <Tv size={24} />;
    const DEFAULT_PROJECT_ICON = <FileCode2 size={24} />;
    return (
        <DefaultContext.Provider
            value={{
                DEFAULT_STARTING_PATH,
                DEFAULT_ICON,
                DEFAULT_SHOW_ICON,
                DEFAULT_FOLDER_ICON,
                DEFAULT_FILE_ICON,
                DEFAULT_TV_ICON,
                DEFAULT_PROJECT_ICON
            }}
        >
            {children}
        </DefaultContext.Provider>
    );
};

export const useDefaults = () => {
    const context = useContext(DefaultContext);
    if (context === undefined) {
        throw new Error('useDefaults must be used within a DefaultProvider');
    }
    return context;
};
