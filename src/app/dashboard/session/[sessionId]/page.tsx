"use client";

import React, { useState, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Play, Pause, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SessionDetail({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="min-h-screen flex flex-col p-6 bg-[var(--bg-color)]">
      <header className="flex justify-between items-center mb-6 border-b border-[var(--glass-border)] pb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="px-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Alice Chen
              <Badge variant="success">Completed</Badge>
            </h1>
            <p className="text-[var(--text-muted)] text-sm">Frontend Engineer • Interviewed 2 hours ago</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="danger">Reject Candidate</Button>
          <Button variant="primary">Move to Round 2</Button>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Col: Video & Proctoring (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="p-0 overflow-hidden flex flex-col border border-[var(--glass-border)]">
            <div className="aspect-video bg-black relative flex items-center justify-center border-b border-[var(--glass-border)]">
              {/* Fake Video Player for Mock */}
              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-[var(--text-muted)] flex-col gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                     onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-2" />}
                </div>
                <p>Merged Session Playback ({resolvedParams.sessionId}.webm)</p>
              </div>
            </div>
            <div className="p-4 bg-[var(--bg-color)] flex items-center gap-4">
              <div className="w-full h-1 bg-white/10 rounded-full cursor-pointer relative">
                <div className="absolute left-0 top-0 h-full bg-[var(--primary)] rounded-full w-1/3" />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">05:24 / 15:00</span>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                Proctoring Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-sm">
                  <div className="font-mono text-[var(--text-muted)] w-12">02:14</div>
                  <Badge variant="warning">Tab Switch</Badge>
                  <p className="text-[var(--text-muted)] flex-1">Candidate switched to another window for 14 seconds.</p>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <div className="font-mono text-[var(--text-muted)] w-12">08:45</div>
                  <Badge variant="danger">Face Absent</Badge>
                  <p className="text-[var(--text-muted)] flex-1">No face detected in frame for 5 seconds.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Evaluation & Transcript (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border-[var(--primary)]/30 shadow-[var(--shadow-glow)]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                AI Evaluation
                <Badge variant="info" className="text-base">Score: 92/100</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-[var(--glass-border)]">
                  <p className="text-[var(--text-muted)] text-sm mb-1">Technical Skills</p>
                  <p className="text-2xl font-bold text-[var(--success)]">95%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-[var(--glass-border)]">
                  <p className="text-[var(--text-muted)] text-sm mb-1">Communication</p>
                  <p className="text-2xl font-bold text-[var(--primary)]">88%</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm text-[var(--text-muted)] uppercase tracking-wider">AI Recommendation</h4>
                <p className="text-sm leading-relaxed bg-[var(--primary)]/10 p-4 rounded-lg border border-[var(--primary)]/20">
                  The candidate demonstrated exceptional knowledge of React hooks and state management. They clearly explained the difference between useMemo and useCallback with practical examples. Communication was clear, though they paused significantly on the system design question. <strong>Recommendation: Advance to Technical Round 2.</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2 text-[var(--success)]">Strengths</h4>
                  <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)]">
                    <li>React performance optimization</li>
                    <li>Clear verbal articulation</li>
                    <li>Code structuring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-[var(--warning)]">Areas to Probe</h4>
                  <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)]">
                    <li>System design scaling</li>
                    <li>Database indexing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg">Synchronized Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              <div className="p-3 rounded bg-[var(--primary)]/10 border-l-2 border-[var(--primary)]">
                <p className="text-xs text-[var(--primary)] font-semibold mb-1">Question 1</p>
                <p className="text-sm">Can you explain the virtual DOM in React?</p>
              </div>
              <div className="flex gap-3 text-sm group">
                <span className="font-mono text-[var(--text-muted)] text-xs mt-0.5">00:15</span>
                <p className="flex-1 text-gray-300 group-hover:text-white transition-colors">
                  Sure. The virtual DOM is essentially a lightweight copy of the actual DOM. React uses it to figure out what needs to change in the UI when the state updates.
                </p>
              </div>
              <div className="flex gap-3 text-sm group">
                <span className="font-mono text-[var(--text-muted)] text-xs mt-0.5">00:28</span>
                <p className="flex-1 text-gray-300 group-hover:text-white transition-colors">
                  Instead of updating the real DOM directly, which is slow, React compares the new virtual DOM with a snapshot of the previous one. This is called "diffing".
                </p>
              </div>
              {/* More transcript lines would go here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
