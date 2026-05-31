"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Video,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Modal } from "./Modal";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Candidates", href: "/dashboard", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, role } = useAuth();
  const [showPricing, setShowPricing] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
    <aside className="w-64 min-h-screen bg-white dark:bg-zinc-950 border-r border-black/5 dark:border-white/5 flex flex-col p-4 sticky top-0 transition-colors">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Video className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          InterviewX
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-3 mb-3">
          Overview
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/analytics" && pathname === "/analytics");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/10 dark:from-indigo-600/10 dark:to-purple-600/10">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
            Upgrade to Pro 🔥
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            Get unlimited interviews and advanced AI analytics.
          </p>
          <button 
            onClick={() => setShowPricing(true)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Upgrade
          </button>
        </div>

        <div 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {role === "RECRUITER" ? "R" : "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{role === "RECRUITER" ? "Recruiter" : "Candidate"}</p>
            <p className="text-xs text-zinc-500 truncate">user@interviewx.ai</p>
          </div>
          <LogOut className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
        </div>
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Sun className="w-4 h-4 hidden dark:block" />
          <Moon className="w-4 h-4 block dark:hidden" />
          <span className="text-xs font-medium">Toggle Theme</span>
        </button>
      </div>
    </aside>

    <Modal isOpen={showPricing} onClose={() => setShowPricing(false)} title="Upgrade to Pro">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Unlock Full Potential</h3>
          <p className="text-zinc-400 text-sm">Choose the plan that fits your hiring needs.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 border border-white/10 rounded-2xl bg-zinc-900/50 flex flex-col">
            <h4 className="text-lg font-semibold text-white mb-1">Pro</h4>
            <p className="text-3xl font-bold text-indigo-400 mb-4">$49<span className="text-sm text-zinc-500 font-normal">/mo</span></p>
            <ul className="text-sm text-zinc-400 space-y-2 mb-6 flex-1">
              <li>✓ Unlimited interviews</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Custom branding</li>
            </ul>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm">
              Current Plan
            </button>
          </div>
          <div className="p-5 border border-indigo-500/30 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg text-white">POPULAR</div>
            <h4 className="text-lg font-semibold text-white mb-1">Enterprise</h4>
            <p className="text-3xl font-bold text-white mb-4">$199<span className="text-sm text-zinc-500 font-normal">/mo</span></p>
            <ul className="text-sm text-zinc-400 space-y-2 mb-6 flex-1">
              <li>✓ Everything in Pro</li>
              <li>✓ API Access</li>
              <li>✓ ATS Integrations</li>
              <li>✓ Dedicated Support</li>
            </ul>
            <button 
              onClick={() => {
                alert("Redirecting to checkout...");
                setShowPricing(false);
              }}
              className="w-full py-2 bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors font-semibold text-sm"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
}
