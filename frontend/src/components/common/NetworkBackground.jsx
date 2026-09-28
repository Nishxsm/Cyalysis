import { useEffect, useRef } from "react";

export default function NetworkBackground({
  nodeCount = 55,
  connectionDistance = 150,
  lineOpacity = 0.16,
  nodeOpacity = 0.45,
  speed = 0.12,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame;
    let width = 0;
    let height = 0;
    let nodes = [];

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }

    function createNodes() {
      nodes = Array.from(
        { length: nodeCount },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,

          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,

          radius: Math.random() * 1.2 + 0.6,
        })
      );
    }

    function updateNodes() {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) {
          node.x = width + 20;
        }

        if (node.x > width + 20) {
          node.x = -20;
        }

        if (node.y < -20) {
          node.y = height + 20;
        }

        if (node.y > height + 20) {
          node.y = -20;
        }
      });
    }

    function drawConnections() {
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const first = nodes[i];
          const second = nodes[j];

          const dx = first.x - second.x;
          const dy = first.y - second.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance > connectionDistance) {
            continue;
          }

          const opacity =
            (1 - distance / connectionDistance) *
            lineOpacity;

          context.beginPath();

          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);

          context.strokeStyle =
            `rgba(0, 184, 156, ${opacity})`;

          context.lineWidth = 0.6;

          context.stroke();
        }
      }
    }

    function drawNodes() {
      nodes.forEach((node) => {
        context.beginPath();

        context.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(0, 184, 156, ${nodeOpacity})`;

        context.fill();
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      updateNodes();
      drawConnections();
      drawNodes();

      animationFrame =
        requestAnimationFrame(draw);
    }

    function handleResize() {
      resizeCanvas();
      createNodes();
    }

    resizeCanvas();
    createNodes();
    draw();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [
    nodeCount,
    connectionDistance,
    lineOpacity,
    nodeOpacity,
    speed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="network-background"
      aria-hidden="true"
    />
  );
}