import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { RouteTracker } from "./contexts/DustyContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/home/Home";
import { ROUTES } from "./constants/routes";

// Pages
import { Shows } from "./pages/shows/Shows";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { Music } from "./pages/music/Music";
import { Videos } from "./pages/videos/Videos";
import { Images } from "./pages/images/Images";
import { Misc } from "./pages/misc/Misc";
import { ZipPage } from "./pages/zip/ZipPage";
import { Lab } from "./pages/Lab";
import { Settings } from "./pages/Settings";
import { TodoPage } from "./pages/todo/TodoPage";

function App() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="app-container">
            <RouteTracker />
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
                    <Route path={ROUTES.LAB} element={<Lab />} />
                    <Route path={ROUTES.TODO} element={<TodoPage />} />
                    <Route path={ROUTES.SETTINGS} element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
