import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Learn from "./pages/Learn";
import StrategyLab from "./pages/StrategyLab";
import RaceExplainer from "./pages/RaceExplainer";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden text-slate-50">
      <div className="motorsport-bg" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/strategy-lab" element={<StrategyLab />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/race-explainer" element={<RaceExplainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
