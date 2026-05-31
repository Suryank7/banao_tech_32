"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
export interface Message {
  id: string;
  senderId: string;
  senderRole: "RECRUITER" | "CANDIDATE";
  text: string;
  timestamp: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number | null;
  status: "Completed" | "Failed" | "In Progress" | "Pending" | "Rejected" | "Advanced";
  time: string;
  avatar: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  nextAction: string;
  transcript: { question: string; timestamp: string; answer: string }[];
  proctoring: { time: string; type: string; desc: string; severity: string }[];
  questionScores: number[];
}

interface DataContextType {
  candidates: Candidate[];
  addCandidate: (c: Partial<Candidate>) => void;
  updateCandidateStatus: (id: string, status: Candidate["status"]) => void;
  messages: Record<string, Message[]>;
  sendMessage: (candidateId: string, text: string, senderRole: "RECRUITER" | "CANDIDATE") => void;
}

// Initial Mock Data
const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "1", name: "Alice Chen", email: "alice@example.com", role: "Frontend Engineer",
    score: 92, status: "Completed", time: "2 hours ago", avatar: "AC",
    overallScore: 92, technicalScore: 95, communicationScore: 88, problemSolvingScore: 91,
    strengths: ["Exceptional React/TypeScript knowledge", "Clear and structured communication"],
    weaknesses: ["Paused significantly on rate-limiting question"],
    recommendation: "Alice demonstrated exceptional knowledge of React hooks and state management.",
    nextAction: "Advance to Technical Round 2",
    transcript: [{ question: "Optimizing slow queries", timestamp: "00:15", answer: "I used EXPLAIN ANALYZE..." }],
    proctoring: [{ time: "02:14", type: "Tab Switch", desc: "Switched window", severity: "warning" }],
    questionScores: [95, 88, 82, 96, 90],
  },
  {
    id: "2", name: "Bob Smith", email: "bob@example.com", role: "Backend Engineer",
    score: 85, status: "Completed", time: "5 hours ago", avatar: "BS",
    overallScore: 85, technicalScore: 88, communicationScore: 80, problemSolvingScore: 87,
    strengths: ["Strong backend architecture knowledge"],
    weaknesses: ["Communication could be more concise"],
    recommendation: "Bob showed solid backend engineering skills.",
    nextAction: "Advance to Technical Round 2",
    transcript: [{ question: "Optimizing slow queries", timestamp: "00:12", answer: "Use EXPLAIN..." }],
    proctoring: [],
    questionScores: [90, 82, 85, 92, 78],
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", senderId: "recruiter1", senderRole: "RECRUITER", text: "Hi Alice, great interview today!", timestamp: "11:24 AM" },
    { id: "m2", senderId: "1", senderRole: "CANDIDATE", text: "Thank you so much! I really enjoyed the questions.", timestamp: "11:25 AM" },
  ]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCands = localStorage.getItem("candidates");
    const storedMsgs = localStorage.getItem("messages");

    if (storedCands) {
      setCandidates(JSON.parse(storedCands));
    } else {
      setCandidates(INITIAL_CANDIDATES);
      localStorage.setItem("candidates", JSON.stringify(INITIAL_CANDIDATES));
    }

    if (storedMsgs) {
      setMessages(JSON.parse(storedMsgs));
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem("messages", JSON.stringify(INITIAL_MESSAGES));
    }
  }, []);

  const saveCandidates = (newData: Candidate[]) => {
    setCandidates(newData);
    localStorage.setItem("candidates", JSON.stringify(newData));
  };

  const saveMessages = (newData: Record<string, Message[]>) => {
    setMessages(newData);
    localStorage.setItem("messages", JSON.stringify(newData));
  };

  const addCandidate = (c: Partial<Candidate>) => {
    const newCand: Candidate = {
      id: uuidv4(),
      name: c.name || "Unknown",
      email: c.email || "unknown@example.com",
      role: c.role || "Candidate",
      score: null,
      status: "Pending",
      time: "Just now",
      avatar: (c.name || "U").substring(0, 2).toUpperCase(),
      overallScore: Math.floor(Math.random() * 40) + 60, // Mock scores
      technicalScore: Math.floor(Math.random() * 40) + 60,
      communicationScore: Math.floor(Math.random() * 40) + 60,
      problemSolvingScore: Math.floor(Math.random() * 40) + 60,
      strengths: ["Fast learner", "Good potential"],
      weaknesses: ["Needs more practical experience"],
      recommendation: "AI preliminary evaluation complete. Awaiting recruiter review.",
      nextAction: "Pending Review",
      transcript: [],
      proctoring: [],
      questionScores: [80, 85, 75, 90, 85],
      ...c
    };
    saveCandidates([...candidates, newCand]);
  };

  const updateCandidateStatus = (id: string, status: Candidate["status"]) => {
    const updated = candidates.map(c => c.id === id ? { ...c, status } : c);
    saveCandidates(updated);
  };

  const sendMessage = (candidateId: string, text: string, senderRole: "RECRUITER" | "CANDIDATE") => {
    const newMsg: Message = {
      id: uuidv4(),
      senderId: senderRole === "RECRUITER" ? "recruiter" : candidateId,
      senderRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const existing = messages[candidateId] || [];
    const updatedMsgs = {
      ...messages,
      [candidateId]: [...existing, newMsg]
    };
    saveMessages(updatedMsgs);
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <DataContext.Provider value={{ candidates, addCandidate, updateCandidateStatus, messages, sendMessage }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
