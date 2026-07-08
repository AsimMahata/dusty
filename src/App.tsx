import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./components/Home";

// Pages
import { Shows } from "./pages/Shows";
import { Projects } from "./pages/Projects";
import { Music } from "./pages/Music";
import { Videos } from "./pages/Videos";
import { Images } from "./pages/Images";
import { Misc } from "./pages/Misc";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-container">
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
