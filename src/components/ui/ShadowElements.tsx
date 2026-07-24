import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "../layout/Sidebar";
import { FloatingScrollTop } from "./FloatingScrollTop";

const RouteTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path !== "/settings" && path !== "/lab" && path !== "/todo") {
            localStorage.setItem("last_opened_page", path);
        }
    }, [location.pathname]);

    return null;
};

export const ShadowElements: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <>
            <RouteTracker />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                    }
                }}
            />
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />
            <FloatingScrollTop />
        </>
    )
}
