import React, { useEffect, useRef, useState } from "react";
import "../../styles/components/audioWaveVisualizer.css";

export default function AudioWaveVisualizer({ isListening }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isListening) {
      stopVisualizer();
      return;
    }

    startVisualizer();

    return () => {
      stopVisualizer();
    };
  }, [isListening]);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      analyserRef.current.fftSize = 64;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      draw();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
  };

  const stopVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const drawFrame = () => {
      animationRef.current = requestAnimationFrame(drawFrame);

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, width, height);

      const barWidth = 8;
      const barGap = 4;
      const barCount = Math.floor(width / (barWidth + barGap));

      for (let i = 0; i < barCount; i++) {
        const value = dataArrayRef.current[i];
        const barHeight = (value / 255) * height;

        ctx.fillStyle = "#2A5CAF";
        ctx.fillRect(
          i * (barWidth + barGap),
          height - barHeight,
          barWidth,
          barHeight
        );
      }
    };

    drawFrame();
  };

  return <canvas ref={canvasRef} width={200} height={40} />;
}
