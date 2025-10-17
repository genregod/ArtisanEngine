import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Calendar, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: releases = [] } = useQuery({
    queryKey: ["/api/releases"],
  });

  const activeReleases = releases.filter((r: any) => r.status === "scheduled" || r.status === "released");
  const draftReleases = releases.filter((r: any) => r.status === "draft");

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your release overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Releases"
          value={activeReleases.length}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="+2 this month"
        />
        <StatCard
          title="Draft Releases"
          value={draftReleases.length}
          icon={<Calendar className="w-4 h-4" />}
          trend="Ready to schedule"
        />
        <StatCard
          title="Templates"
          value="24"
          icon={<FileText className="w-4 h-4" />}
          trend="Pre-built content"
        />
        <StatCard
          title="AI Credits"
          value="∞"
          icon={<Sparkles className="w-4 h-4" />}
          trend="Unlimited"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/releases">
              <Button className="w-full justify-start" variant="outline" data-testid="button-new-release">
                <Calendar className="w-4 h-4 mr-2" />
                Create New Release
              </Button>
            </Link>
            <Link href="/ai-tools">
              <Button className="w-full justify-start" variant="outline" data-testid="button-generate-content">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content with AI
              </Button>
            </Link>
            <Link href="/calendar">
              <Button className="w-full justify-start" variant="outline" data-testid="button-view-calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Content Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {releases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No releases yet. Create your first one to get started!</p>
            ) : (
              <div className="space-y-3">
                {releases.slice(0, 3).map((release: any) => (
                  <div key={release.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{release.title}</p>
                      <p className="text-xs text-muted-foreground">{release.artist}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      release.status === 'released' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      release.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {release.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Strategies Incorporated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <StrategyCard
              title="Artist Funnel"
              description="Awareness → Engagement → Conversion framework for building sustainable fanbase"
            />
            <StrategyCard
              title="Content Weeks"
              description="Themed weekly content: The Story Behind, The Echo, The Response, The Deep Dive"
            />
            <StrategyCard
              title="Waterfall Strategy"
              description="Sequential single releases to maintain algorithmic momentum and fan engagement"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(' ', '-')}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}

function StrategyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
