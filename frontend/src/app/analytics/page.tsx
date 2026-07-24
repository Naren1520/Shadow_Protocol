'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { StatCard } from '@/shared/components/ui/stat-card';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';

// Inline mini chart — kept for future use
// const BarMini: React.FC<{ values: number[]; color?: string }>

const monthlyFIRs = [1820, 1650, 1930, 2100, 2340, 2190, 1980, 2420, 2300, 2650, 2780, 2940];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const crimeCategories = [
  { name: 'Crimes Against Property', count: 9842, pct: 85, color: 'bg-blue-500', badge: 'info' as const },
  { name: 'Crimes Against Person', count: 6214, pct: 68, color: 'bg-red-500', badge: 'danger' as const },
  { name: 'NDPS Act', count: 3180, pct: 42, color: 'bg-amber-500', badge: 'warning' as const },
  { name: 'Crimes Against Women', count: 2940, pct: 35, color: 'bg-purple-500', badge: 'purple' as const },
  { name: 'Economic Offences', count: 1654, pct: 22, color: 'bg-emerald-500', badge: 'success' as const },
];

const topDistricts = [
  { name: 'Bengaluru Urban', count: 8412, trend: '+4.1%', up: true },
  { name: 'Mysuru', count: 3214, trend: '-1.2%', up: false },
  { name: 'Dharwad', count: 2891, trend: '+2.8%', up: true },
  { name: 'Belagavi', count: 2654, trend: '-0.5%', up: false },
  { name: 'Hubballi-Dharwad', count: 1988, trend: '+1.9%', up: true },
];

const hotspots = [
  { location: 'MG Road, Bengaluru', type: 'Theft / Robbery', risk: 'High', incidents: 142 },
  { location: 'Mysuru Road Corridor', type: 'Vehicle Crime', risk: 'High', incidents: 98 },
  { location: 'Chickpet Market', type: 'Pickpocketing', risk: 'Medium', incidents: 76 },
  { location: 'Indiranagar 100ft Road', type: 'Assault', risk: 'Medium', incidents: 62 },
  { location: 'Shivajinagar Bus Stand', type: 'Theft', risk: 'Medium', incidents: 54 },
];

const riskBadge = (r: string) => {
  if (r === 'High') return <Badge variant="danger" dot>{r}</Badge>;
  if (r === 'Medium') return <Badge variant="warning" dot>{r}</Badge>;
  return <Badge variant="success" dot>{r}</Badge>;
};

export default function AnalyticsPage() {
  const [selectedYear] = useState('2026');

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Crime Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Intelligence dashboard · Karnataka Police · FY {selectedYear}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
              Filters
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total FIRs"
            value="28,176"
            subtitle="FY 2026"
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
            trend={{ value: 4.2, label: 'vs FY 2025' }}
          />
          <StatCard
            title="Detection Rate"
            value="68.4%"
            subtitle="Cases with chargesheet"
            icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            trend={{ value: 2.1, label: 'vs last year' }}
          />
          <StatCard
            title="Heinous Crimes"
            value="4,821"
            subtitle="IPC heinous offences"
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            iconBg="bg-red-50"
            trend={{ value: -1.8, label: 'vs last year' }}
          />
          <StatCard
            title="Arrests Made"
            value="19,340"
            subtitle="Including surrenders"
            icon={<Users className="h-5 w-5 text-amber-600" />}
            iconBg="bg-amber-50"
            trend={{ value: 5.6, label: 'vs last year' }}
          />
        </div>

        {/* Monthly trend chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly FIR Trend — 2026</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">FIRs registered per month</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">+4.2% YoY</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {monthlyFIRs.map((v, i) => {
                const max = Math.max(...monthlyFIRs);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {v.toLocaleString()}
                    </span>
                    <div
                      className="w-full bg-primary-600 rounded-t-sm hover:bg-primary-700 transition-colors cursor-default"
                      style={{ height: `${(v / max) * 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1 mt-1">
              {months.map((m) => (
                <div key={m} className="flex-1 text-center text-xs text-muted-foreground">
                  {m}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crime categories + Districts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Crime categories */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Crime Categories</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Top offence groups</p>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {crimeCategories.map((cat) => (
                  <li key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{cat.name}</span>
                        <Badge variant={cat.badge}>{cat.count.toLocaleString()}</Badge>
                      </div>
                      <span className="text-xs text-secondary">{cat.pct}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* District ranking */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Top Districts</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">By total FIRs</p>
              </div>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {topDistricts.map((d, i) => (
                  <li key={d.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted text-xs font-semibold text-secondary flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{d.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm tabular-nums text-secondary">
                            {d.count.toLocaleString()}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              d.up ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {d.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Hotspot table */}
        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-foreground">Crime Hotspots</h3>
            <Badge variant="danger" className="ml-auto">
              {hotspots.length} active
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  {['Location', 'Primary Crime Type', 'Incidents', 'Risk Level'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hotspots.map((h, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                        <span className="font-medium text-foreground">{h.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-secondary">{h.type}</td>
                    <td className="px-6 py-3.5 font-semibold text-foreground tabular-nums">{h.incidents}</td>
                    <td className="px-6 py-3.5">{riskBadge(h.risk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
