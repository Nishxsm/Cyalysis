import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Analysis from "./pages/Analysis";
import Insights from "./pages/Insights";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/insights/:scanId" element={<Insights />} />
      </Routes>
    </BrowserRouter>
  );
}
