import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Filter, ChevronRight, User, Clock, Brain, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Mock data
const SESSIONS = [
  { id: '1', name: 'Alice Chen', role: 'Frontend Engineer', score: 92, status: 'Completed', time: '2 hours ago' },
  { id: '2', name: 'Bob Smith', role: 'Backend Engineer', score: 85, status: 'Completed', time: '5 hours ago' },
  { id: '3', name: 'Charlie Davis', role: 'Full Stack Engineer', score: 40, status: 'Failed', time: '1 day ago' },
  { id: '4', name: 'Diana Prince', role: 'Product Manager', score: null, status: 'In Progress', time: 'Just now' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6 bg-[var(--bg-color)]">
      <header className="flex justify-between items-center mb-8 border-b border-[var(--glass-border)] pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Recruiter Dashboard</h1>
          <p className="text-[var(--text-muted)]">Manage and review candidate interviews.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button variant="primary">New Invitation</Button>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Interviews', value: '124', icon: <User className="text-[var(--primary)]" /> },
          { title: 'Pending Review', value: '12', icon: <Clock className="text-[var(--warning)]" /> },
          { title: 'Avg. Technical Score', value: '78%', icon: <Brain className="text-[var(--secondary)]" /> },
          { title: 'Avg. Communication', value: '82%', icon: <MessageSquare className="text-[var(--success)]" /> },
        ].map((stat, i) => (
          <Card key={i} className="hover:border-[var(--glass-border)]/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--text-muted)]">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Recent Sessions</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[var(--glass-border)] rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--primary)] text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-sm text-[var(--text-muted)]">
                  <th className="pb-3 font-medium px-4">Candidate</th>
                  <th className="pb-3 font-medium px-4">Role</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                  <th className="pb-3 font-medium px-4">AI Score</th>
                  <th className="pb-3 font-medium px-4">Date</th>
                  <th className="pb-3 font-medium px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {SESSIONS.map((session) => (
                  <tr key={session.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                    <td className="py-4 px-4 font-medium">{session.name}</td>
                    <td className="py-4 px-4 text-[var(--text-muted)]">{session.role}</td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        session.status === 'Completed' ? 'success' : 
                        session.status === 'Failed' ? 'danger' : 'warning'
                      }>
                        {session.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {session.score ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${session.score >= 80 ? 'bg-[var(--success)]' : session.score >= 50 ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`} 
                              style={{ width: `${session.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{session.score}%</span>
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)] text-sm">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[var(--text-muted)] text-sm">{session.time}</td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/dashboard/session/${session.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Review <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
