"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HardwareCheck } from "@/components/interview/HardwareCheck";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { Button } from "@/components/ui/Button";
import { io, Socket } from "socket.io-client";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  AlertCircle,
  StopCircle,
  Volume2,
  VolumeX,
  CheckCircle,
  Clock,
  ArrowRight,
  Home,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    text: "Can you describe a time when you had to optimize a slow-performing database query?",
    subtext: "Walk me through your approach.",
  },
  {
    text: "How do you handle disagreements with a product manager or designer regarding technical constraints?",
    subtext: "Give a specific example.",
  },
  {
    text: "Explain how you would design a rate-limiting system for a public API.",
    subtext: "What algorithms and data stores would you use?",
  },
  {
    text: "Describe a complex bug you recently encountered.",
    subtext: "How did you debug and ultimately resolve it?",
  },
  {
    text: "Where do you see the future of frontend development heading with the rise of AI tools?",
    subtext: "How are you adapting?",
  },
];

export default function DemoInterviewPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerCompleted, setIsAnswerCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionId] = useState(() => uuidv4());
  const { login } = useAuth();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { startRecording, stopRecording, isRecording } = useMediaRecorder(
    sessionId,
    socketRef
  );

  // ===== TTS: Speak the question aloud =====
  const speakQuestion = useCallback(
    (index: number) => {
      if (isMuted || typeof window === "undefined") return;
      window.speechSynthesis.cancel();
      const q = QUESTIONS[index];
      const utterance = new SpeechSynthesisUtterance(
        `${q.text} ${q.subtext}`
      );
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      // Try to pick a nice English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") || v.name.includes("Samantha"))
      );
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  // ===== WebSocket Connection =====
  useEffect(() => {
    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;
    socket.on("connect", () => {
      socket.emit("join-session", { sessionId });
    });
    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  // ===== Start Interview =====
  const handleHardwareComplete = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    setHasStarted(true);
    setTimeout(() => {
      startRecording(mediaStream, 1);
      speakQuestion(0);
    }, 1000);
  };

  // ===== Attach video stream =====
  useEffect(() => {
    if (hasStarted && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [hasStarted, stream]);

  // ===== Recording Timer =====
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // ===== Proctoring =====
  const [violations, setViolations] = useState(0);
  useEffect(() => {
    if (!hasStarted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((v) => v + 1);
        socketRef.current?.emit("proctor-event", {
          sessionId,
          type: "TAB_SWITCH",
          timestamp: new Date().toISOString(),
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, sessionId]);

  // ===== Format time =====
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // ===== Handle Stop =====
  const handleStop = () => {
    stopRecording();
    setIsAnswerCompleted(true);
    window.speechSynthesis.cancel();
  };

  // ===== Handle Next Question =====
  const handleNext = () => {
    setIsAnswerCompleted(false);
    setCurrentQuestionIndex((prev) => prev + 1);
    startRecording(stream!, currentQuestionIndex + 2);
    speakQuestion(currentQuestionIndex + 1);
  };

  // ===== Handle Finish =====
  const handleFinish = () => {
    window.speechSynthesis.cancel();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsFinished(true);
  };

  // ===== Pre-Interview: Hardware Check =====
  if (!hasStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 theme-dark">
        <HardwareCheck onComplete={handleHardwareComplete} />
      </main>
    );
  }

  // ===== Completion Screen =====
  if (isFinished) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 theme-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Interview Complete!
          </h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Thank you for completing the interview. Your responses have been
            recorded and will be evaluated by our AI system.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <p className="text-2xl font-bold text-white">
                {QUESTIONS.length}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Questions</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <p className="text-2xl font-bold text-white">
                {violations}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Violations</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
              <p className="text-2xl font-bold text-white">AI</p>
              <p className="text-xs text-zinc-500 mt-1">Evaluating</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
            <button
              onClick={() => {
                login("CANDIDATE");
                router.push(`/dashboard/session/${sessionId}`);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              View Results <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // ===== Active Interview UI =====
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 theme-dark">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">IX</span>
          </div>
          <span className="text-sm font-medium text-zinc-400">
            AI Interview Session
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full transition-all duration-500 ${
                i < currentQuestionIndex
                  ? "bg-emerald-500"
                  : i === currentQuestionIndex
                  ? "bg-indigo-500"
                  : "bg-zinc-800"
              }`}
            />
          ))}
          <span className="text-xs text-zinc-500 ml-2">
            {currentQuestionIndex + 1}/{QUESTIONS.length}
          </span>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            window.speechSynthesis.cancel();
          }}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
          title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel — Question */}
        <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center border-r border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Badge
                variant="outline"
                className="mb-6 bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              >
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-semibold text-white leading-snug mb-4">
                {QUESTIONS[currentQuestionIndex].text}
              </h2>
              <p className="text-lg text-zinc-500 leading-relaxed">
                {QUESTIONS[currentQuestionIndex].subtext}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-10 flex items-center gap-4">
            {!isAnswerCompleted ? (
              <Button
                variant="destructive"
                className="rounded-xl px-6 font-medium shadow-lg"
                onClick={handleStop}
              >
                <StopCircle className="w-4 h-4 mr-2" /> Stop Recording
              </Button>
            ) : currentQuestionIndex < QUESTIONS.length - 1 ? (
              <Button
                variant="default"
                className="rounded-xl px-6 font-medium shadow-lg bg-indigo-600 hover:bg-indigo-500"
                onClick={handleNext}
              >
                Next Question <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="default"
                className="rounded-xl px-6 font-medium shadow-lg bg-emerald-600 hover:bg-emerald-500"
                onClick={handleFinish}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Finish Interview
              </Button>
            )}

            {/* Timer */}
            {isRecording && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Video */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
          <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* Recording Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 backdrop-blur-xl rounded-full border border-white/10">
              <span className="relative flex h-2.5 w-2.5">
                {isRecording && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isRecording ? "bg-red-500" : "bg-zinc-600"
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-zinc-300">
                {isRecording ? "REC" : "PAUSED"}
              </span>
            </div>

            {/* Proctoring Badge */}
            <div className="absolute top-4 right-4">
              {violations > 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur-xl rounded-full border border-red-500/20">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-medium text-red-300">
                    {violations} Violations
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 backdrop-blur-xl rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">
                    Proctoring Active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
