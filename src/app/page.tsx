"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video, Sparkles, ChevronDown, Zap, MessageSquare, ArrowRight, Settings, BarChart } from "lucide-react";

// ===== FAQ Data =====
const FAQS = [
  {
    q: "How is InterviewX different from other mock interview platforms?",
    a: "InterviewX provides an interactive, AI-driven interview experience that adapts to your responses in real time. Unlike traditional mock interviews, our AI dynamically adjusts follow-up questions, offers instant feedback, and tailors the session to your performance. This ensures a more personalized and effective way to improve your interview skills.",
  },
  {
    q: "Is there a free trial available for InterviewX AI interviews?",
    a: "Yes! We offer a free demo mode where candidates can experience the full AI interview flow without creating an account. Recruiters can sign up for a 14-day free trial with unlimited interviews.",
  },
  {
    q: "Who should use InterviewX AI interview coaching?",
    a: "InterviewX is designed for both job seekers looking to practice and improve their interview skills, and recruiters who want to automate first-round screening with AI-powered evaluation.",
  },
  {
    q: "What is the typical length of an AI interview session?",
    a: "A standard session consists of 5 questions and typically takes 15-25 minutes. Recruiters can customize the number of questions and session duration based on the role requirements.",
  },
  {
    q: "How does InterviewX AI analyze my responses and provide feedback?",
    a: "Our AI evaluates responses across multiple dimensions: technical accuracy, communication clarity, problem-solving approach, and confidence. Each response is scored individually and contributes to an overall hiring recommendation.",
  },
  {
    q: "Can I customize my interview experience for different job roles?",
    a: "Absolutely! Recruiters can configure custom question sets for different roles — from frontend engineering to product management. The AI adapts its evaluation criteria based on the role context.",
  },
];

// ===== Features Data =====
const FEATURES = [
  {
    title: "1-way AI interviews",
    desc: "Candidates can complete interviews 24/7. Our AI interviewer asks follow-up questions in real-time, just like a human.",
    bg: "bg-yellow-200",
    textColor: "text-yellow-900",
    icon: <Video className="w-8 h-8 text-yellow-800" />,
    rotation: "-rotate-2",
  },
  {
    title: "Automated AI grading",
    desc: "Get instant evaluation of candidates' technical skills, communication, and problem-solving abilities.",
    bg: "bg-purple-200",
    textColor: "text-purple-900",
    icon: <Settings className="w-8 h-8 text-purple-800" />,
    rotation: "rotate-2",
  },
  {
    title: "Track student progress support",
    desc: "Dashboard to monitor student engagement, improvement trends, and identify those who need additional support.",
    bg: "bg-blue-200",
    textColor: "text-blue-900",
    icon: <BarChart className="w-8 h-8 text-blue-800" />,
    rotation: "-rotate-1",
  },
  {
    title: "Detailed feedback & coaching",
    desc: "Our AI interviewer delivers instant feedback on accuracy, structure, and clarity, plus an example answer for comparison.",
    bg: "bg-green-200",
    textColor: "text-green-900",
    icon: <MessageSquare className="w-8 h-8 text-green-800" />,
    rotation: "rotate-1",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="theme-warm min-h-screen">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-forest-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">InterviewX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/demo-start" className="hover:text-gray-900 transition-colors">AI Interview</Link>
            <Link href="/analytics" className="hover:text-gray-900 transition-colors">Features</Link>
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">For Recruiters</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Log In
            </Link>
            <Link
              href="/demo-start"
              className="text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              It&apos;s Free Try Now!
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-600/10 border border-forest-600/20 mb-8">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <span className="text-sm font-medium text-forest-600">Next-Gen AI Technology</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-8">
            AI Interviewer get your dream top{" "}
            <span className="relative inline-block">
              <span className="relative z-10">talent.</span>
              <span className="absolute bottom-1 left-0 w-full h-4 bg-yellow-300 -z-0 rounded-sm" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Configure custom interview questions, integrate with your ATS via webhooks, and get comprehensive performance analysis on every candidate. Evaluate everyone fairly while focusing your time on top talent.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/demo-start"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-forest-600 text-white font-semibold rounded-full hover:bg-forest-700 transition-all shadow-lg shadow-forest-600/20 text-sm"
            >
              Practice For Free Try Now!
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-gray-800 font-semibold rounded-full border border-gray-200 hover:border-gray-300 transition-all text-sm hover:shadow-sm"
            >
              Hire Top Talent
            </Link>
          </div>

          {/* Trusted By */}
          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm font-medium">
            <span className="text-gray-500">Trusted by Students</span>
            <span className="font-bold text-gray-700 text-base">stripe</span>
            <span className="font-bold text-gray-700 text-base">HubSpot</span>
            <span className="font-bold text-gray-700 text-base">coinbase</span>
            <span className="font-bold text-gray-700 text-base">Google</span>
          </div>
        </div>

        {/* Hero Video Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative rounded-3xl overflow-hidden border-4 border-orange-400/80 shadow-2xl shadow-orange-400/10 aspect-video bg-zinc-900">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            >
              {/* Sample interview video file */}
              <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Live Indicator overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-white">REC</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (Sticky Notes style) ===== */}
      <section className="py-24 px-6 bg-orange-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20px 20px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {FEATURES.slice(0, 2).map((f, i) => (
              <div
                key={i}
                className={`${f.bg} ${f.rotation} rounded-2xl p-8 shadow-xl hover:rotate-0 transition-transform duration-500 cursor-default`}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/50 rounded-full">Career Preparation</span>
                </div>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${f.textColor}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${f.textColor} opacity-70`}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4">
            Common Challenges in
          </h2>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
            Career{" "}
            <span className="relative inline-block">
              Preparation
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full" />
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.slice(2).map((f, i) => (
              <div
                key={i}
                className={`${f.bg} ${f.rotation} rounded-2xl p-8 shadow-xl hover:rotate-0 transition-transform duration-500 cursor-default`}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/50 rounded-full">Career Preparation</span>
                </div>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${f.textColor}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${f.textColor} opacity-70`}>{f.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-white/60 mt-16 max-w-2xl mx-auto leading-relaxed">
            Transform your career services with our AI interviewer platform. Give every student unlimited practice with AI interview technology that provides personalized feedback and builds real confidence.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-6 bg-cream-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Three simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Configure", desc: "Set up your interview with custom questions tailored to the role.", icon: <Settings className="w-8 h-8 text-yellow-600 mx-auto" />, color: "border-yellow-400 bg-yellow-50" },
              { step: "02", title: "Interview", desc: "Candidates complete the AI-powered video interview at their convenience.", icon: <Video className="w-8 h-8 text-purple-600 mx-auto" />, color: "border-purple-400 bg-purple-50" },
              { step: "03", title: "Evaluate", desc: "Review AI-generated scores, transcripts, and hiring recommendations.", icon: <BarChart className="w-8 h-8 text-green-600 mx-auto" />, color: "border-green-400 bg-green-50" },
            ].map((s, i) => (
              <div key={i} className={`${s.color} border-2 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow`}>
                <div className="mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Step {s.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-24 px-6 bg-cream-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" /> For Job Seekers
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-500">Everything you need to know about InterviewX&apos;s AI interview platform</p>
          </div>

          <div className="space-y-0">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-dashed border-gray-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className={`text-base font-semibold transition-colors ${openFaq === i ? "text-gray-900" : "text-gray-700"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ${openFaq === i ? "max-h-[300px] pb-5" : "max-h-0"}`}
                >
                  <div className={`p-5 rounded-xl ${openFaq === i ? "bg-green-100/50 border border-green-200/50" : ""}`}>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-6 bg-cream-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-300 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Prepare students for career success.
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Transform your career services with our AI interviewer platform. Give every student unlimited practice with AI interview technology that provides personalized feedback and builds real confidence.
              </p>
              <Link
                href="/demo-start"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 text-white font-semibold rounded-full hover:bg-forest-700 transition-all text-sm"
              >
                It&apos;s Free Try Now! <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-8xl">🏆</div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">InterviewX</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Next-gen AI-powered video interview platform for modern hiring teams.
            </p>
          </div>
          {[
            { title: "Product", links: ["AI Interview", "For Recruiters", "Pricing", "Enterprise"] },
            { title: "Resources", links: ["Documentation", "Blog", "Changelog", "Support"] },
            { title: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2024 InterviewX. Built with ❤️ and a relentless focus on UI/UX excellence.
        </div>
      </footer>
    </div>
  );
}
