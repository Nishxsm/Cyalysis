import { useState } from "react";
import AnalysisInput from "../components/analysis/AnalysisInput";
import ScanProgress from "../components/analysis/ScanProgress";

export default function Analysis() {
  const [scanning, setScanning] = useState(false);
  const [target, setTarget] = useState("");

  const handleStartScan = (url) => {
    setTarget(url);
    setScanning(true);
  };

  return (
    <main className="analysis-page">
      {!scanning ? (
        <AnalysisInput onStart={handleStartScan} />
      ) : (
        <ScanProgress target={target} />
      )}
    </main>
  );
}