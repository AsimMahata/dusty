import { Routes, Route } from "react-router-dom";
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
import { PdfPage } from "./pages/pdf/PdfPage";
import { LabPage } from "./pages/lab/LabPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { TodoPage } from "./pages/todo/TodoPage";
import { TerminalPage } from "./pages/terminal/TerminalPage";
import { ShadowElements } from "./components/ui/ShadowElements";



function App() {
    return (
        <div className="app-container">
            <ShadowElements />
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
        </div>
    );
}

export default App;
