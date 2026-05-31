"use client";

import React, { useState, useEffect, useRef } from 'react';
import { HardwareCheck } from '@/components/interview/HardwareCheck';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { Button } from '@/components/ui/Button';
import { io } from 'socket.io-client';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function DemoInterviewPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  
  const socketRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { startRecording, stopRecording, isRecording } = useMediaRecorder(sessionId, socketRef);

  useEffect(() => {
    // Connect to WebSocket Server
    const socket = io({ path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-session', { sessionId });
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const handleHardwareComplete = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    setHasStarted(true);
    
    // Auto-start recording question 1
    setTimeout(() => {
      startRecording(mediaStream, 1);
    }, 1000);
  };

  useEffect(() => {
    if (hasStarted && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [hasStarted, stream]);

  // Simple Proctoring (Tab Switch)
  const [violations, setViolations] = useState(0);
  useEffect(() => {
    if (!hasStarted) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(v => v + 1);
        socketRef.current?.emit('proctor-event', {
          sessionId,
          type: 'TAB_SWITCH',
          timestamp: new Date().toISOString()
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasStarted, sessionId]);

  if (!hasStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-color)]">
        <HardwareCheck onComplete={handleHardwareComplete} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-6 bg-[var(--bg-color)]">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="info">Q1 of 5</Badge>
          <span className="text-[var(--text-muted)] font-medium">Software Engineer Interview</span>
        </div>
        
        <div className="flex items-center gap-4">
          {violations > 0 ? (
            <Badge variant="danger" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {violations} Violation(s)
            </Badge>
          ) : (
            <Badge variant="success" className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Proctoring Active
            </Badge>
          )}
          
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            {isRecording ? 'Recording' : 'Paused'}
          </div>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: AI Question */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl text-[var(--text-muted)] mb-4">Question 1</h3>
            <p className="text-2xl font-semibold leading-relaxed">
              Can you describe a time when you had to optimize a slow-performing database query? Walk me through your approach.
            </p>
          </div>
          
          <Button size="lg" className="w-full py-6 text-lg shadow-[var(--shadow-glow)]" onClick={() => {
            // Mock next question logic
            stopRecording();
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          }}>
            Submit Response & Next
          </Button>
        </div>

        {/* Right Column: Video Preview */}
        <div className="lg:col-span-2 glass-panel p-2 flex flex-col">
          <div className="flex-1 bg-black rounded-xl overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
