import Hero from "./components/landing/Hero";
import Navbar from "./components/layout/Navbar";
import SecurityCTA from "./components/landing/SecurityCTA";
import SecurityProblem from "./components/landing/SecurityProblem";
import TechnologyAnalysis from "./components/landing/TechnologyAnalysis";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <SecurityProblem />
      <TechnologyAnalysis />
      <SecurityCTA />
      
    </>
  );
}

