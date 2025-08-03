import { useEffect, useRef, useState } from "react";

export default function useSpeechRecognition({ onResult, onEnd }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }

      onResult?.(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult, onEnd]);

  const start = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      console.warn("Already listening");
      return;
    }

    try {
      recognition.abort();
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return { start, stop, isListening };
}
