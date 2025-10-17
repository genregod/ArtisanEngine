import { Button } from "@/components/ui/button";
import { Music, Calendar, Target, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight" data-testid="text-landing-title">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SmartArt AIO
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-testid="text-landing-subtitle">
                Your all-in-one release management platform for artists
              </p>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto" data-testid="text-landing-description">
              Plan releases, schedule multi-platform posts, generate AI-powered content, 
              and analyze performance—all from one powerful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6" 
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                Get Started
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
              <FeatureCard
                icon={<Music className="w-8 h-8" />}
                title="Release Management"
                description="Plan and track your music releases with waterfall and momentum strategies"
              />
              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Content Calendar"
                description="Pre-built content week templates based on proven marketing strategies"
              />
              <FeatureCard
                icon={<Sparkles className="w-8 h-8" />}
                title="AI-Powered Tools"
                description="Generate captions, scripts, and ad copy optimized for each platform"
              />
              <FeatureCard
                icon={<Target className="w-8 h-8" />}
                title="Analytics Dashboard"
                description="Track Spotify algorithm metrics, YouTube performance, and engagement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-purple-600 dark:text-purple-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
