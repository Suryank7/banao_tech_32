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
  const handleInvite = () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.role) return;
    addCandidate(newCandidate);
    setNewCandidate({ name: "", email: "", role: "" });
    setShowInvite(false);
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 theme-dark">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
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
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 py-1 animate-slide-up">
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
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Invitation Button */}
            <Button
              variant="default"
              onClick={() => setShowInvite(true)}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" /> New Invitation
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <Card key={i} className="hover:border-white/10 transition-all duration-300 cursor-default">
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
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sessions Table */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-base">Recent Sessions</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
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
                  <tr className="border-b border-white/5 text-xs text-zinc-500 uppercase tracking-widest">
                    <th className="pb-3 font-medium px-4">Candidate</th>
                    <th className="pb-3 font-medium px-4">Role</th>
                    <th className="pb-3 font-medium px-4">Status</th>
                    <th className="pb-3 font-medium px-4">AI Score</th>
                    <th className="pb-3 font-medium px-4">Date</th>
                    <th className="pb-3 font-medium px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
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
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {session.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">{session.name}</p>
                              <p className="text-xs text-zinc-500">{session.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-400 text-sm">{session.role}</td>
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
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
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
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite New Candidate">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              <User className="w-3 h-3 inline mr-1" /> Full Name
            </label>
            <input
              type="text"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              <Mail className="w-3 h-3 inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={newCandidate.email}
              onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
              placeholder="john@company.com"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              <Briefcase className="w-3 h-3 inline mr-1" /> Role
            </label>
            <input
              type="text"
              value={newCandidate.role}
              onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
              placeholder="Frontend Engineer"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowInvite(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button variant="default" onClick={handleInvite} className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500">
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
