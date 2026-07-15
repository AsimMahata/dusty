import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { RouteTracker } from "./contexts/DustyContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./components/Home";

// Pages
import { Shows } from "./pages/shows/Shows";
import { Projects } from "./pages/Projects";
import { Music } from "./pages/Music";
import { Videos } from "./pages/Videos";
import { Images } from "./pages/Images";
import { Misc } from "./pages/misc/Misc";
import { Zip } from "./pages/Zip";
import { Lab } from "./pages/Lab";
import { Settings } from "./pages/Settings";

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
                    <Route path="/" element={<Home />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/images" element={<Images />} />
                    <Route path="/misc" element={<Misc />} />
                    <Route path="/zip" element={<Zip />} />
                    <Route path="/lab" element={<Lab />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
