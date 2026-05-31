"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LineChart } from "@/components/ui/Chart";
import {
  ArrowLeft,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Target,
  MessageSquare,
  Brain,
  Shield,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useData, Candidate } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";

// Removed static CANDIDATES dictionary, now using useData()

// ===== Focus Areas (Inspired by Image 5) =====
function getFocusAreas(c: Candidate) {
  return [
    { name: "Technical Skills", icon: Brain, status: c.technicalScore >= 70 ? "Success" : "Pending", trend: c.technicalScore >= 70 ? "up" : "down" },
    { name: "Communication", icon: MessageSquare, status: c.communicationScore >= 70 ? "Success" : "Pending", trend: c.communicationScore >= 70 ? "up" : "down" },
    { name: "Problem Solving", icon: Target, status: c.problemSolvingScore >= 70 ? "Success" : "Pending", trend: c.problemSolvingScore >= 70 ? "up" : "down" },
    { name: "Interview Integrity", icon: Shield, status: c.proctoring.length <= 1 ? "Success" : "Pending", trend: c.proctoring.length <= 1 ? "up" : "down" },
  ];
}

export default function SessionDetail({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const { candidates, updateCandidateStatus } = useData();
  const { role } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const candidate = candidates.find(c => c.id === resolvedParams.sessionId) || candidates[0];
  
  const focusAreas = candidate ? getFocusAreas(candidate) : [];

  // Try to load video from local storage
  useEffect(() => {
    fetch(`/api/video/${resolvedParams.sessionId}`)
      .then((res) => {
        if (res.ok) return res.blob();
        return null;
      })
      .then((blob) => {
        if (blob && blob.size > 0) {
          setVideoSrc(URL.createObjectURL(blob));
        }
      })
      .catch(() => {});
  }, [resolvedParams.sessionId]);

  if (!candidate) return <div className="p-8 text-white">Loading candidate...</div>;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="min-h-screen flex flex-col p-4 lg:p-8 bg-zinc-950 theme-dark font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white">{candidate.name}</h1>
              <Badge variant={candidate.status === "Completed" ? "success" : candidate.status === "Failed" ? "destructive" : "secondary"} className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold">
                {candidate.status}
              </Badge>
            </div>
            <p className="text-zinc-500 text-sm">{candidate.role} &bull; Interviewed {candidate.time}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {role === "RECRUITER" && (
            <>
              <Link href={`/dashboard/chat/${candidate.id}`}>
                <Button variant="secondary" className="gap-2 rounded-lg">
                  <MessageCircle className="w-4 h-4" /> Chat
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                onClick={() => updateCandidateStatus(candidate.id, "Rejected")}
              >
                Reject
              </Button>
              <Button 
                variant="default" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/20 px-6"
                onClick={() => updateCandidateStatus(candidate.id, "Advanced")}
              >
                {candidate.nextAction.includes("Advance") ? "Advance to Round 2" : "Reconsider"}
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Video Player */}
          <Card className="p-0 overflow-hidden border-white/5 bg-zinc-900/20 shadow-2xl">
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {videoSrc ? (
                <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/20 flex items-center justify-center flex-col gap-4">
                  <p className="text-zinc-600 text-sm">No video recording found for this session</p>
                </div>
              )}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-lg">
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                </div>
              </div>
            </div>
            <div className="p-4 bg-zinc-900/50 flex items-center gap-4">
              <div className="w-full h-1 bg-zinc-800 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full w-1/3 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
              <span className="text-xs font-mono text-zinc-500 tracking-wider whitespace-nowrap">05:24 / 15:00</span>
            </div>
          </Card>

          {/* Proctoring Timeline */}
          <Card className="border-white/5 bg-zinc-900/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 text-amber-500/70" /> Proctoring Timeline ({candidate.proctoring.length} events)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.proctoring.length === 0 ? (
                <p className="text-sm text-zinc-500">No proctoring violations detected. ✓</p>
              ) : (
                <div className="space-y-3">
                  {candidate.proctoring.map((p, i) => (
                    <div key={i} className="flex items-start gap-4 text-sm p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="font-mono text-zinc-500 w-12 pt-0.5">{p.time}</div>
                      <Badge variant={p.severity === "danger" ? "destructive" : "outline"} className={p.severity === "warning" ? "text-amber-400 border-amber-400/20 bg-amber-400/10" : ""}>
                        {p.type}
                      </Badge>
                      <p className="text-zinc-400 flex-1 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Focus Areas (Image 5 inspired) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-white/5 bg-zinc-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-400 flex items-center justify-between">
                  Focus Areas
                  <span className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400">See all &gt;</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-zinc-600 uppercase tracking-widest">
                      <th className="text-left pb-3 font-medium">Name</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-right pb-3 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {focusAreas.map((f, i) => (
                      <tr key={i}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <f.icon className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300 font-medium">{f.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={f.status === "Success" ? "success" : "secondary"} className="text-[10px]">
                            {f.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          {f.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400 inline" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Score Timeline */}
            <Card className="border-white/5 bg-zinc-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-400">Score Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={candidate.questionScores}
                  labels={["Q1", "Q2", "Q3", "Q4", "Q5"]}
                  color={candidate.overallScore >= 70 ? "#10b981" : "#ef4444"}
                  height={140}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* AI Evaluation */}
          <Card className="border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.05] to-transparent shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-indigo-400 uppercase tracking-widest flex items-center justify-between">
                AI Evaluation
                <span className="text-2xl font-light text-white tracking-tighter normal-case">
                  {candidate.overallScore}<span className="text-zinc-500 text-lg">/100</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Technical</p>
                  <p className={`text-3xl font-extralight tracking-tighter ${candidate.technicalScore >= 70 ? "text-emerald-400" : "text-red-400"}`}>
                    {candidate.technicalScore}%
                  </p>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Communication</p>
                  <p className={`text-3xl font-extralight tracking-tighter ${candidate.communicationScore >= 70 ? "text-indigo-400" : "text-red-400"}`}>
                    {candidate.communicationScore}%
                  </p>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Problem Solving</p>
                  <p className={`text-3xl font-extralight tracking-tighter ${candidate.problemSolvingScore >= 70 ? "text-purple-400" : "text-red-400"}`}>
                    {candidate.problemSolvingScore}%
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-2">Strengths</h4>
                  <ul className="space-y-1.5">
                    {candidate.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-2">Areas to Improve</h4>
                  <ul className="space-y-1.5">
                    {candidate.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-xs text-zinc-300 uppercase tracking-widest">Recommendation</h4>
                <p className="text-sm leading-relaxed text-zinc-400">{candidate.recommendation}</p>
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${candidate.overallScore >= 70 ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300" : "bg-red-500/10 border border-red-500/20 text-red-300"}`}>
                  → {candidate.nextAction}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="flex-1 flex flex-col min-h-[400px] border-white/5 bg-zinc-900/20">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-sm text-zinc-400 uppercase tracking-widest">
                Interview Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-6 pr-4 space-y-6">
              {candidate.transcript.map((t, i) => (
                <div key={i}>
                  <div className="relative pl-4 border-l border-indigo-500/50 mb-3">
                    <div className="absolute w-2 h-2 rounded-full bg-indigo-500 -left-[4.5px] top-1.5 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Question {i + 1}</p>
                    <p className="text-sm text-zinc-200 font-medium mt-1">{t.question}</p>
                  </div>
                  <div className="flex gap-4 text-sm group">
                    <span className="font-mono text-zinc-600 text-xs mt-1 w-10">{t.timestamp}</span>
                    <p className="flex-1 text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
                      {t.answer}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
