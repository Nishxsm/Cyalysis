import Hero from "./components/landing/Hero";
import Navbar from "./components/layout/Navbar";
import SecurityCTA from "./components/landing/SecurityCTA";
import SecurityProblem from "./components/landing/SecurityProblem";
import TechnologyAnalysis from "./components/landing/TechnologyAnalysis";
import Footer from "./components/layout/Footer"
import HowItWorks from "./components/landing/Howitworks";

import Reveal from "./components/common/reveal";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />

      <Reveal>
      <HowItWorks />
      </Reveal>

      <Reveal>
      <SecurityProblem />
      </Reveal>

      <Reveal>
      <TechnologyAnalysis />
      </Reveal>

      <Reveal>
      <SecurityCTA />
      </Reveal>

      <Reveal>
      <Footer />
      </Reveal>
      
    </>
  );
}

