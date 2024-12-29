import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

// TypeScript interfaces remain the same
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  size?: number;
  color?: string;
  className?: string;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({
  onTranscriptChange,
  size = 24,
  color = "currentColor",
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<null | SpeechRecognition>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results as SpeechRecognitionResultList)
          .map((result: SpeechRecognitionResult) => result[0].transcript)
          .join(' ');
        onTranscriptChange(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(recognition);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscriptChange]);

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!recognition) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <button
      onClick={toggleRecording}
      type="button"
      className={`speech-recorder-button ${className}`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      style={{
        padding: '8px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {isRecording ? (
        <MicOff size={size} color={color} />
      ) : (
        <Mic size={size} color={color} />
      )}
    </button>
  );
};


export default SpeechRecorder;