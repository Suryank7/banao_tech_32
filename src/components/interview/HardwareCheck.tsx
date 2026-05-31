import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Mic, Video as VideoIcon, CheckCircle, AlertTriangle } from 'lucide-react';

interface HardwareCheckProps {
  onComplete: (stream: MediaStream) => void;
}

export function HardwareCheck({ onComplete }: HardwareCheckProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestPermissions = async () => {
    setIsChecking(true);
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(err.message || 'Could not access camera or microphone.');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Cleanup if component unmounts before completing
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleContinue = () => {
    if (stream) {
      onComplete(stream);
    }
  };

  return (
    <Card className="max-w-xl mx-auto w-full shadow-[var(--shadow-glow)]">
      <CardHeader className="text-center">
        <CardTitle>Hardware Check</CardTitle>
        <CardDescription>Let's make sure your camera and microphone are working.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden border border-[var(--glass-border)] flex items-center justify-center">
          {!stream ? (
            <div className="text-[var(--text-muted)] flex flex-col items-center gap-2">
              <VideoIcon className="w-12 h-12 mb-2 opacity-50" />
              <p>Camera preview will appear here</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          )}

          {error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center text-[var(--danger)]">
              <AlertTriangle className="w-10 h-10 mb-2" />
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2 text-[var(--text-muted)]">Please allow permissions in your browser and try again.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-[var(--glass-border)] flex items-center gap-3">
            <VideoIcon className={`w-6 h-6 ${stream ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`} />
            <div>
              <p className="font-semibold text-sm">Camera</p>
              <p className="text-xs text-[var(--text-muted)]">{stream ? 'Connected' : 'Waiting...'}</p>
            </div>
            {stream && <CheckCircle className="w-5 h-5 text-[var(--success)] ml-auto" />}
          </div>
          
          <div className="p-4 rounded-lg bg-white/5 border border-[var(--glass-border)] flex items-center gap-3">
            <Mic className={`w-6 h-6 ${stream ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`} />
            <div>
              <p className="font-semibold text-sm">Microphone</p>
              <p className="text-xs text-[var(--text-muted)]">{stream ? 'Connected' : 'Waiting...'}</p>
            </div>
            {stream && <CheckCircle className="w-5 h-5 text-[var(--success)] ml-auto" />}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          {!stream ? (
            <Button onClick={requestPermissions} isLoading={isChecking} className="w-full">
              Grant Permissions
            </Button>
          ) : (
            <Button onClick={handleContinue} className="w-full" variant="primary">
              Start Interview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
