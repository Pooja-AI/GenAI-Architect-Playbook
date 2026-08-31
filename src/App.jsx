import { HashRouter, Routes, Route } from "react-router-dom";

import GenAIQuestion from "./pages/GenAIQuestion";
import Navbar from "./components/Navbar";

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<GenAIQuestion/>} />
        
      </Routes>
    </HashRouter>
  );
}

export default App;