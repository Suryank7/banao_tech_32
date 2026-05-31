import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Video, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-[var(--glass-border)] bg-[var(--bg-color)]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center animate-pulse shadow-[var(--shadow-glow)]">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Interviewer</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login?role=recruiter">
            <Button variant="ghost">Recruiter Login</Button>
          </Link>
          <Link href="/demo-start">
            <Button variant="primary">Try as Candidate</Button>
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24 pb-20 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary)]/20 rounded-full blur-[100px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-white/5 backdrop-blur-sm mb-8 animate-fade-in text-sm font-medium">
          <Sparkles className="w-4 h-4 text-[var(--warning)]" />
          <span>Next-gen automated screening is here</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Hire the <span className="text-gradient">top 1%</span> faster with AI-driven video interviews.
        </h1>
        
        <p className="text-xl text-[var(--text-muted)] max-w-2xl mb-12 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Scale your first-round screening asynchronously. Our AI asks the right questions, analyzes responses in real-time, and provides unbiased hiring signals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <Link href="/demo-start">
            <Button size="lg" className="w-full sm:w-auto shadow-[var(--shadow-glow)]">
              Start Candidate Demo
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Recruiter Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/20 border-t border-[var(--glass-border)]">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:border-[var(--primary)]/50 transition-colors duration-300">
              <CardHeader>
                <Zap className="w-10 h-10 text-[var(--primary)] mb-2" />
                <CardTitle>Real-Time Intelligence</CardTitle>
                <CardDescription>Instant Speech-to-Text and continuous context.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">
                  The AI adapts questions dynamically based on the candidate&apos;s previous responses and resume data, powered by deepgram and advanced LLMs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--secondary)]/50 transition-colors duration-300">
              <CardHeader>
                <Video className="w-10 h-10 text-[var(--secondary)] mb-2" />
                <CardTitle>Streaming Architecture</CardTitle>
                <CardDescription>Never lose a recording again.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">
                  Video and audio are captured in chunks and streamed via WebSockets, ensuring network drops don&apos;t result in lost interviews.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--success)]/50 transition-colors duration-300">
              <CardHeader>
                <ShieldCheck className="w-10 h-10 text-[var(--success)] mb-2" />
                <CardTitle>Automated Proctoring</CardTitle>
                <CardDescription>Maintain interview integrity.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">
                  Built-in face detection and tab-switch tracking flags suspicious behavior in real-time, giving recruiters peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-[var(--text-muted)] text-sm border-t border-[var(--glass-border)]">
        Built for scalability and precision.
      </footer>
    </main>
  );
}
