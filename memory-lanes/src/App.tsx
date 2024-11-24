import './App.css';
import { TopBar } from './components/ui/TopBar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from './components/About';
import Story from './components/Story';
import { Toaster } from 'sonner';

function App() {

  return (
    <Router>
      <div>
        {/* TopBar is outside Routes, so it renders on every page */}
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/story/:id" element={<Story />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
