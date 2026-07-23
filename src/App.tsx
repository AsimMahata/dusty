import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/home/Home";
import { ROUTES } from "./constants/routes";
import { Toaster } from "react-hot-toast";

// Pages
import { Shows } from "./pages/shows/Shows";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { Music } from "./pages/music/Music";
import { Videos } from "./pages/videos/Videos";
import { Images } from "./pages/images/Images";
import { Misc } from "./pages/misc/Misc";
import { ZipPage } from "./pages/zip/ZipPage";
import { PdfPage } from "./pages/pdf/PdfPage";
import { LabPage } from "./pages/lab/LabPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { TodoPage } from "./pages/todo/TodoPage";
import { FloatingScrollTop } from "./components/ui/FloatingScrollTop";
import { TerminalPage } from "./pages/Terminal/TerminalPage";

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

function App() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="app-container">
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

            <main className="main-content">
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.SHOWS} element={<Shows />} />
                    <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
                    <Route path={ROUTES.MUSIC} element={<Music />} />
                    <Route path={ROUTES.VIDEOS} element={<Videos />} />
                    <Route path={ROUTES.IMAGES} element={<Images />} />
                    <Route path={ROUTES.MISC} element={<Misc />} />
                    <Route path={ROUTES.ZIP} element={<ZipPage />} />
                    <Route path={ROUTES.PDF} element={<PdfPage />} />
                    <Route path={ROUTES.LAB} element={<LabPage />} />
                    <Route path={ROUTES.TODO} element={<TodoPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path={ROUTES.TERMINAL} element={<TerminalPage />} />
                </Routes>
            </main>
            <FloatingScrollTop />
        </div>
    );
}

export default App;
