import { useState, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

export function useMediaRecorder(sessionId: string, socketRef: React.MutableRefObject<Socket | null>) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkIndexRef = useRef(0);
  const currentQuestionRef = useRef(0);

  const startRecording = useCallback((stream: MediaStream, questionIndex: number) => {
    currentQuestionRef.current = questionIndex;
    
    // Use WebM format with Opus audio (standard for browser streaming)
    let options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
    }

    const recorder = new MediaRecorder(stream, options);
    
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0 && socketRef.current) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            socketRef.current?.emit('media-chunk', {
              sessionId,
              chunkIndex: chunkIndexRef.current++,
              questionIndex: currentQuestionRef.current,
              buffer: reader.result
            });
          }
        };
        reader.readAsArrayBuffer(event.data);
      }
    };

    recorder.start(3000); // 3 second chunks
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }, [sessionId, socketRef]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return { isRecording, startRecording, stopRecording };
}
