import React, { useEffect, useRef } from 'react';
import { loadModel, detectCard } from './detector';

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function init() {
      const video = videoRef.current!;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await new Promise((res) => (video.onloadedmetadata = res));
      await video.play();

      await loadModel();

      const canvas = canvasRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;

      async function loop() {
        const { x, y, w, h } = await detectCard(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x * canvas.width,
          y * canvas.height,
          w * canvas.width,
          h * canvas.height
        );

        requestAnimationFrame(loop);
      }

      loop();
    }

    init().catch(console.error);
  }, []);

  return (
    <div className="h-screen w-screen relative">
      <video
        ref={videoRef}
        className="size-full absolute z-10"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="size-full absolute z-20 bg-black" />
    </div>
  );
};

export default App;
