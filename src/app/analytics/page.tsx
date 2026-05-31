"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sidebar } from "@/components/ui/Sidebar";
import { BarChart, LineChart, DonutChart, StackedBar } from "@/components/ui/Chart";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Zap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/context/DataContext";
import { v4 as uuidv4 } from "uuid";

// Mock analytics data
const KPI = [
  { title: "Total Interviews", value: "284", change: "+15.3%", up: true, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", donut: 78, donutColor: "#6366f1" },
  { title: "Avg. Score", value: "68.2%", change: "+5.2%", up: true, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", donut: 68, donutColor: "#10b981" },
  { title: "Avg. Duration", value: "12.3 min", change: "-18.2%", up: true, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", donut: 45, donutColor: "#f59e0b" },
  { title: "Pass Rate", value: "73.4%", change: "+12.5%", up: true, icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", donut: 73, donutColor: "#a855f7" },
];

const TEAM_PERFORMANCE = [
  { label: "Liam", value: 85, color: "#6366f1" },
  { label: "Avery", value: 72, color: "#818cf8" },
  { label: "Luna", value: 90, color: "#6366f1" },
  { label: "Ella", value: 65, color: "#818cf8" },
  { label: "Chloe", value: 78, color: "#6366f1" },
  { label: "Hazel", value: 55, color: "#818cf8" },
  { label: "Jade", value: 88, color: "#6366f1" },
];

const INTERVIEW_SOURCES = [
  { label: "Direct Link", value: 38, color: "#6366f1" },
  { label: "Email Invite", value: 28, color: "#10b981" },
  { label: "API Integration", value: 15, color: "#f59e0b" },
  { label: "Referral", value: 12, color: "#a855f7" },
  { label: "Other", value: 7, color: "#71717a" },
];

const FUNNEL = [
  { stage: "Invited", count: 420, pct: "100%" },
  { stage: "Started", count: 312, pct: "74.3%" },
  { stage: "Completed", count: 284, pct: "67.6%" },
  { stage: "Qualified", count: 156, pct: "37.1%" },
  { stage: "Meetings Booked", count: 89, pct: "21.2%" },
  { stage: "Hired", count: 34, pct: "8.1%" },
];

const PERFORMANCE_TABLE = [
  { name: "Jamie Fox", subtitle: "Top Performer", leads: 245, conv: 180, rate: 73.5, revenue: "$345k", up: true },
  { name: "Aliya Smith", subtitle: "Excellent Communication", leads: 234, conv: 130, rate: 77.2, revenue: "$323k", up: true },
  { name: "Ben Carter", subtitle: "Dedicated Agent", leads: 180, conv: 53, rate: 60.2, revenue: "$287k", up: false },
  { name: "Isabelle Rodriguez", subtitle: "Consistent Performance", leads: 234, conv: 65, rate: 68.2, revenue: "$276k", up: false },
];

const ENGAGEMENT_DATA = [25, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85];
const ENGAGEMENT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsPage() {
  const { candidates, addCandidate } = useData();
  const [showNewLeadModal, setShowNewLeadModal] = React.useState(false);
  const [leadName, setLeadName] = React.useState("");
  const [leadEmail, setLeadEmail] = React.useState("");
  const [leadRole, setLeadRole] = React.useState("Frontend Developer");

  const handleExport = () => {
    // Generate CSV from candidates
    if (candidates.length === 0) return;
    const header = Object.keys(candidates[0]).join(",");
    const rows = candidates.map(c => Object.values(c).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "interviewx_candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;
    addCandidate({
      id: uuidv4(),
      name: leadName,
      role: leadRole,
      email: leadEmail,
      status: "Invited",
      score: 0,
      time: "Just now",
      avatar: leadName.charAt(0).toUpperCase(),
      nextAction: "Wait for interview",
    });
    setShowNewLeadModal(false);
    setLeadName("");
    setLeadEmail("");
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
              <span>Overview</span>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-300">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="rounded-xl" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="default" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => setShowNewLeadModal(true)}>
              <Users className="w-4 h-4 mr-2" /> + New Lead
            </Button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI.map((kpi, i) => (
            <Card key={i} className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 hover:border-indigo-500/40 dark:hover:border-white/20 transition-all shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <DonutChart value={kpi.donut} color={kpi.donutColor} size={52} strokeWidth={5} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{kpi.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Team Performance */}
          <Card className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center border-b border-indigo-500/10 dark:border-white/5 pb-4">
              <CardTitle className="text-sm text-indigo-900 dark:text-white font-semibold">Candidate Performance</CardTitle>
              <Badge variant="secondary" className="text-[10px] bg-indigo-600/10 text-indigo-700 dark:bg-zinc-800 dark:text-zinc-300">Weekly</Badge>
            </CardHeader>
            <CardContent>
              <BarChart data={TEAM_PERFORMANCE} height={200} />
            </CardContent>
          </Card>

          {/* Interview Sources */}
          <Card className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center border-b border-indigo-500/10 dark:border-white/5 pb-4">
              <div>
                <CardTitle className="text-sm mb-2 text-indigo-900 dark:text-white font-semibold">Interview Sources</CardTitle>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-zinc-500">Total Invited</span>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">15,420</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Completed</span>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">2,847</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StackedBar segments={INTERVIEW_SOURCES} />
            </CardContent>
          </Card>
        </div>

        {/* Funnel */}
        <Card className="mb-8 bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 shadow-sm">
          <CardHeader className="border-b border-indigo-500/10 dark:border-white/5 pb-4">
            <CardTitle className="text-sm text-indigo-900 dark:text-white font-semibold">Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2">
              {FUNNEL.map((f, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className="mx-auto rounded-xl bg-gradient-to-t from-indigo-600/20 to-indigo-600/5 border border-indigo-500/10 flex items-end justify-center mb-3 transition-all hover:from-indigo-600/30"
                    style={{ height: `${Math.max(30, (f.count / 420) * 120)}px` }}
                  >
                    <span className="text-indigo-400 text-xs font-bold pb-2">{f.pct}</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{f.stage}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{f.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Table */}
          <Card className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 shadow-sm">
            <CardHeader className="border-b border-indigo-500/10 dark:border-white/5 pb-4">
              <CardTitle className="text-sm text-indigo-900 dark:text-white font-semibold">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-indigo-600 dark:text-zinc-500 uppercase tracking-widest border-b border-indigo-500/10 dark:border-white/5">
                    <th className="pb-3 font-semibold">Candidate</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Conv. Rate</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-500/10 dark:divide-white/5">
                  {PERFORMANCE_TABLE.map((p, i) => (
                    <tr key={i} className="hover:bg-indigo-600/5 dark:hover:bg-white/[0.02]">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-600/20">
                            {p.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{p.name}</p>
                            <p className="text-xs text-zinc-500">{p.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-zinc-900 dark:text-white font-medium">{p.leads}</td>
                      <td className="py-3">
                        <div className={`flex items-center gap-1 text-sm font-medium ${p.up ? "text-emerald-400" : "text-red-400"}`}>
                          {p.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {p.rate}%
                        </div>
                      </td>
                      <td className="py-3 text-sm text-zinc-400">{p.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Engagement Chart */}
          <Card className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center border-b border-indigo-500/10 dark:border-white/5 pb-4">
              <CardTitle className="text-sm text-indigo-900 dark:text-white font-semibold">Interview Activity</CardTitle>
              <Badge variant="secondary" className="text-[10px] bg-indigo-600/10 text-indigo-700 dark:bg-zinc-800 dark:text-zinc-300">Monthly</Badge>
            </CardHeader>
            <CardContent>
              <LineChart
                data={ENGAGEMENT_DATA}
                labels={ENGAGEMENT_LABELS}
                color="#6366f1"
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Modal isOpen={showNewLeadModal} onClose={() => setShowNewLeadModal(false)} title="Add New Candidate">
        <form onSubmit={handleNewLeadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
            <input required value={leadName} onChange={e => setLeadName(e.target.value)} type="text" className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
            <input required value={leadEmail} onChange={e => setLeadEmail(e.target.value)} type="email" className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Role</label>
            <input required value={leadRole} onChange={e => setLeadRole(e.target.value)} type="text" className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" placeholder="e.g. Frontend Developer" />
          </div>
          <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold mt-4 transition-colors">
            Add Candidate
          </button>
        </form>
      </Modal>
    </div>
  );
}
