import { motion } from "motion/react";
import { Cloud } from "lucide-react";
import "../../styles/landing/SecurityCTA.css";

const clouds = [
  {
    className: "cloud cloud-1",
    size: 150,
    duration: 18,
    delay: 0,
  },
  {
    className: "cloud cloud-2",
    size: 110,
    duration: 22,
    delay: -6,
  },
  {
    className: "cloud cloud-3",
    size: 180,
    duration: 25,
    delay: -12,
  },
  {
    className: "cloud cloud-4",
    size: 95,
    duration: 20,
    delay: -4,
  },
];

export default function SecurityCTA() {
  return (
    <section className="security-cta">
      <div className="security-clouds">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.className}
            className={cloud.className}
            animate={{
              x: ["-20px", "20px", "-20px"],
              y: ["0px", "-10px", "0px"],
            }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Cloud size={cloud.size} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="security-cta-content">
        <h2>
          Stay ahead of
          <br />
          every <span>vulnerability</span>
        </h2>

        <div className="security-cta-actions">
          <button className="security-cta-primary">
            Start Analysis
          </button>

          <button className="security-cta-secondary">
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

