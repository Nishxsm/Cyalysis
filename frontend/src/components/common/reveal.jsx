import { motion } from "motion/react";

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        duration: 1,
        y:5
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;