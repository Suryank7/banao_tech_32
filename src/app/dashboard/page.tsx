"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Search,
  Filter,
  ChevronRight,
  Users,
  Clock,
  Brain,
  MessageSquare,
  Plus,
  TrendingUp,
  TrendingDown,
  X,
  Mail,
  Briefcase,
  User,
} from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/DataContext";

// Removed INITIAL_SESSIONS as it's now in DataContext

const STATS = [
  { title: "Total Interviews", value: "124", change: "+12.5%", up: true, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { title: "Pending Review", value: "12", change: "-3.2%", up: false, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  { title: "Avg. Technical Score", value: "78%", change: "+5.1%", up: true, icon: Brain, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Avg. Communication", value: "82%", change: "+8.4%", up: true, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
];

export default function DashboardPage() {
  const { candidates, addCandidate } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "", role: "" });

  // Filtered + Searched sessions
  const filteredSessions = useMemo(() => {
    return candidates.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "All" || s.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [candidates, searchQuery, filterStatus]);

  // Handle new invitation
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.email || !newCandidate.role) return;
    addCandidate({ ...newCandidate, status: "Invited", nextAction: "Awaiting interview" });
    setNewCandidate({ name: "", email: "", role: "" });
    setShowInvite(false);
  };

  const handleExport = () => {
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

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Manage and review candidate interviews.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Filter Button */}
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setShowFilter(!showFilter)}
                className="rounded-xl"
              >
                <Filter className="w-4 h-4 mr-2" />
                {filterStatus === "All" ? "Filter" : filterStatus}
              </Button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 py-1 animate-slide-up">
                  {["All", "Completed", "Failed", "In Progress"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterStatus === status
                          ? "bg-indigo-600/10 text-indigo-400"
                          : "text-zinc-700 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <Button
              variant="secondary"
              onClick={handleExport}
              className="rounded-xl hidden sm:flex"
            >
              Export
            </Button>

            {/* New Invitation Button */}
            <Button
              variant="default"
              onClick={() => setShowInvite(true)}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> New Invitation
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <Card key={i} className="bg-indigo-600/5 dark:bg-zinc-900 border border-indigo-500/20 dark:border-white/10 hover:border-indigo-500/40 dark:hover:border-white/20 transition-all duration-300 cursor-default shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sessions Table */}
        <Card className="bg-indigo-600/5 dark:bg-zinc-900 border-indigo-500/20 dark:border-white/5 shadow-sm">
          <CardHeader className="flex flex-row justify-between items-center border-b border-indigo-500/10 dark:border-white/5 pb-4">
            <CardTitle className="text-base text-indigo-900 dark:text-white font-semibold">Recent Sessions</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-indigo-500/20 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-900 dark:text-white placeholder-zinc-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/10 dark:border-white/5 text-xs text-indigo-600 dark:text-zinc-500 uppercase tracking-widest">
                    <th className="pb-3 font-semibold px-4">Candidate</th>
                    <th className="pb-3 font-medium px-4">Role</th>
                    <th className="pb-3 font-medium px-4">Status</th>
                    <th className="pb-3 font-medium px-4">AI Score</th>
                    <th className="pb-3 font-medium px-4">Date</th>
                    <th className="pb-3 font-medium px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">
                        No candidates found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="hover:bg-indigo-600/5 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/20">
                              {session.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white text-sm">{session.name}</p>
                              <p className="text-xs text-zinc-500">{session.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400 text-sm">{session.role}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              session.status === "Completed"
                                ? "success"
                                : session.status === "Failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {session.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {session.score ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    session.score >= 80
                                      ? "bg-emerald-500"
                                      : session.score >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${session.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-white">
                                {session.score}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-600 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-zinc-500 text-sm">{session.time}</td>
                        <td className="py-4 px-4 text-right">
                          <Link href={`/dashboard/session/${session.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-indigo-600 dark:text-white hover:bg-indigo-600/10 dark:hover:bg-white/10"
                            >
                              Review <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* New Invitation Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Send New Invitation">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Candidate Name</label>
            <input 
              required 
              value={newCandidate.name} 
              onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} 
              type="text" 
              className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" 
              placeholder="e.g. Alex Johnson" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
            <input 
              required 
              value={newCandidate.email} 
              onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} 
              type="email" 
              className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" 
              placeholder="alex@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Target Role</label>
            <input 
              required 
              value={newCandidate.role} 
              onChange={e => setNewCandidate({...newCandidate, role: e.target.value})} 
              type="text" 
              className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" 
              placeholder="e.g. Senior Frontend Engineer" 
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold mt-4 transition-colors">
            Send Invitation
          </button>
        </form>
      </Modal>
    </div>
  );
}
