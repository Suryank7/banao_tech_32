"use client";

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
    } catch (err: unknown) {
      setError((err as Error).message || 'Could not access camera or microphone.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (stream) {
      onComplete(stream);
    }
  };

  return (
    <Card className="max-w-xl mx-auto w-full">
      <CardHeader className="text-center">
        <CardTitle>Hardware Check</CardTitle>
        <CardDescription>Let&apos;s make sure your camera and microphone are working.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative aspect-video bg-zinc-950/50 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
          {!stream ? (
            <div className="text-zinc-500 flex flex-col items-center gap-3">
              <VideoIcon className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium tracking-wide">Camera preview</p>
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
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-red-400">
              <AlertTriangle className="w-8 h-8 mb-3 opacity-80" />
              <p className="font-medium tracking-wide">{error}</p>
              <p className="text-xs mt-2 text-zinc-500">Please allow permissions in your browser and try again.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 transition-colors hover:bg-white/[0.04]">
            <VideoIcon className={`w-5 h-5 ${stream ? 'text-emerald-500' : 'text-zinc-600'}`} />
            <div>
              <p className="font-medium text-sm text-zinc-200">Camera</p>
              <p className="text-xs text-zinc-500">{stream ? 'Connected' : 'Waiting...'}</p>
            </div>
            {stream && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
          </div>
          
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 transition-colors hover:bg-white/[0.04]">
            <Mic className={`w-5 h-5 ${stream ? 'text-emerald-500' : 'text-zinc-600'}`} />
            <div>
              <p className="font-medium text-sm text-zinc-200">Microphone</p>
              <p className="text-xs text-zinc-500">{stream ? 'Connected' : 'Waiting...'}</p>
            </div>
            {stream && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          {!stream ? (
            <Button onClick={requestPermissions} disabled={isChecking} className="w-full">
              Grant Permissions
            </Button>
          ) : (
            <Button onClick={handleContinue} className="w-full" variant="default">
              Start Interview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
