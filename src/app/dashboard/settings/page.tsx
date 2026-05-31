"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen flex bg-zinc-950 theme-dark">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-zinc-400">Manage your account preferences and configurations.</p>
          </header>

          <div className="flex gap-8">
            {/* Settings Navigation */}
            <nav className="w-64 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === "profile" 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <User className="w-4 h-4" /> Profile Details
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === "notifications" 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === "security" 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Shield className="w-4 h-4" /> Security
              </button>
            </nav>

            {/* Settings Content */}
            <div className="flex-1 space-y-6">
              {activeTab === "profile" && (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Profile Details</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                      {role === "RECRUITER" ? "R" : "C"}
                    </div>
                    <div>
                      <Button variant="secondary" className="mb-2">Change Avatar</Button>
                      <p className="text-xs text-zinc-500">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Profile saved!"); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
                        <input type="text" defaultValue={role === "RECRUITER" ? "Recruiter" : "Candidate"} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
                        <input type="text" defaultValue="User" className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                      <input type="email" defaultValue="user@interviewx.ai" className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
                      <input type="text" disabled value={role === "RECRUITER" ? "Hiring Manager" : "Candidate"} className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-2 text-zinc-500 cursor-not-allowed" />
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Changes</Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Email Notifications</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Interview Completed", desc: "Get notified when a candidate finishes their interview." },
                      { title: "New Message", desc: "Get notified when you receive a chat message." },
                      { title: "Weekly Report", desc: "Receive a weekly summary of hiring pipeline metrics." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between py-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div>
                          <h3 className="text-sm font-medium text-white">{item.title}</h3>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Security & Authentication</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-xl">
                      <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
                        <Key className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">Password</h3>
                        <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                      </div>
                      <Button variant="secondary">Update Password</Button>
                    </div>
                    
                    <div className="pt-6 border-t border-red-500/10">
                      <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
                      <p className="text-xs text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <Button variant="ghost" className="text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20">Delete Account</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
