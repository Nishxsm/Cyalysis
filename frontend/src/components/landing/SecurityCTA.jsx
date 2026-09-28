import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import "../../styles/landing/SecurityCTA.css";

const networkClouds = [
  {
    className: "network-cloud network-cloud-1",
    nodes: [
      [18, 38],
      [42, 20],
      [68, 42],
      [88, 25],
      [55, 65],
      [28, 72],
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [0, 5],
      [5, 4],
      [4, 2],
    ],
    duration: 18,
    delay: 0,
  },
  {
    className: "network-cloud network-cloud-2",
    nodes: [
      [12, 48],
      [34, 28],
      [58, 55],
      [78, 25],
      [92, 50],
      [66, 78],
      [38, 72],
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [2, 5],
      [2, 6],
      [5, 6],
    ],
    duration: 22,
    delay: -6,
  },
  {
    className: "network-cloud network-cloud-3",
    nodes: [
      [20, 52],
      [40, 18],
      [65, 38],
      [84, 20],
      [75, 70],
      [48, 78],
      [28, 68],
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [5, 6],
      [0, 6],
    ],
    duration: 25,
    delay: -12,
  },
  {
    className: "network-cloud network-cloud-4",
    nodes: [
      [18, 42],
      [45, 22],
      [72, 45],
      [52, 72],
      [82, 75],
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 4],
    ],
    duration: 20,
    delay: -4,
  },
];

function NetworkCloud({ nodes, connections }) {
  return (
    <svg
      className="network-cloud-svg"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      {connections.map(([from, to], index) => {
        const first = nodes[from];
        const second = nodes[to];

        return (
          <line
            key={`connection-${index}`}
            x1={first[0]}
            y1={first[1]}
            x2={second[0]}
            y2={second[1]}
          />
        );
      })}

      {nodes.map(([x, y], index) => (
        <circle
          key={`node-${index}`}
          cx={x}
          cy={y}
          r="1.4"
        />
      ))}
    </svg>
  );
}

export default function SecurityCTA() {
  const navigate = useNavigate();

  return (
    <section className="security-cta">
      <div className="security-network-clouds">
        {networkClouds.map((cloud) => (
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
            <NetworkCloud
              nodes={cloud.nodes}
              connections={cloud.connections}
            />
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
          <button
            className="security-cta-primary"
            onClick={() => navigate("/analysis")}
          >
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