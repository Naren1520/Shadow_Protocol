import React from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { StatCard } from '@/shared/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  CalendarDays,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: 'Total FIRs',
    value: '28,176',
    subtitle: 'This financial year',
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-50',
    trend: { value: 4.2, label: 'vs last year' },
  },
  {
    title: 'Open Investigations',
    value: '6,214',
    subtitle: 'Active cases',
    icon: <Search className="h-5 w-5 text-amber-600" />,
    iconBg: 'bg-amber-50',
    trend: { value: -2.8, label: 'vs last month' },
  },
  {
    title: 'Cases Charged',
    value: '9,978',
    subtitle: 'Chargesheets filed',
    icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    iconBg: 'bg-emerald-50',
    trend: { value: 8.1, label: 'vs last year' },
  },
  {
    title: 'High Priority',
    value: '1,024',
    subtitle: 'Heinous offences',
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    iconBg: 'bg-red-50',
    trend: { value: 1.3, label: 'vs last month' },
  },
];

const recentFIRs = [
  {
    crimeNo: '10443000620260041',
    crimeType: 'Robbery',
    station: 'Cubbon Park PS',
    date: '24 Jul 2026',
    status: 'Open',
    gravity: 'Heinous',
  },
  {
    crimeNo: '10443000620260040',
    crimeType: 'Assault',
    station: 'Shivajinagar PS',
    date: '23 Jul 2026',
    status: 'Under Investigation',
    gravity: 'Non-Heinous',
  },
  {
    crimeNo: '10443000620260039',
    crimeType: 'Theft',
    station: 'Indiranagar PS',
    date: '23 Jul 2026',
    status: 'Charged',
    gravity: 'Non-Heinous',
  },
  {
    crimeNo: '10443000620260038',
    crimeType: 'NDPS Act',
    station: 'Banashankari PS',
    date: '22 Jul 2026',
    status: 'Arrested',
    gravity: 'Heinous',
  },
  {
    crimeNo: '10443000620260037',
    crimeType: 'Dacoity',
    station: 'Malleswaram PS',
    date: '22 Jul 2026',
    status: 'Open',
    gravity: 'Heinous',
  },
];

const districtStats = [
  { name: 'Bengaluru Urban', firs: 8412, pct: 90 },
  { name: 'Mysuru', firs: 3214, pct: 65 },
  { name: 'Dharwad', firs: 2891, pct: 58 },
  { name: 'Belagavi', firs: 2654, pct: 52 },
  { name: 'Hubballi', firs: 1988, pct: 40 },
];

const statusBadge = (status: string) => {
  if (status === 'Open') return <Badge variant="danger" dot>{status}</Badge>;
  if (status === 'Under Investigation') return <Badge variant="warning" dot>{status}</Badge>;
  if (status === 'Charged') return <Badge variant="info" dot>{status}</Badge>;
  if (status === 'Arrested') return <Badge variant="success" dot>{status}</Badge>;
  return <Badge variant="neutral">{status}</Badge>;
};

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Command Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Friday, 24 July 2026 · Karnataka Police CID
            </p>
          </div>
          <Link
            href="/crimes"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all FIRs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent FIRs + District Breakdown */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent FIRs */}
          <Card noPadding className="lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Recent FIRs</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Latest registered cases</p>
              </div>
              <Link
                href="/crimes"
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Crime No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Station
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentFIRs.map((fir) => (
                    <tr key={fir.crimeNo} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/crimes/${fir.crimeNo}`}
                          className="font-mono text-xs text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {fir.crimeNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{fir.crimeType}</span>
                          {fir.gravity === 'Heinous' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-secondary">
                          <Building2 className="h-3 w-3 flex-shrink-0" />
                          {fir.station}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-secondary">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          {fir.date}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(fir.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* District breakdown */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>District Breakdown</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">FIRs by district this year</p>
              </div>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {districtStats.map((d) => (
                  <li key={d.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{d.name}</span>
                      <span className="text-sm text-secondary tabular-nums">{d.firs.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-700"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + Crime Trend */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Register FIR',
              desc: 'File a new First Information Report',
              href: '/crimes/new',
              icon: <FileText className="h-5 w-5 text-blue-600" />,
              bg: 'bg-blue-50 hover:bg-blue-100',
            },
            {
              label: 'Search Case',
              desc: 'Look up by crime number',
              href: '/crimes',
              icon: <Search className="h-5 w-5 text-amber-600" />,
              bg: 'bg-amber-50 hover:bg-amber-100',
            },
            {
              label: 'View Analytics',
              desc: 'Crime trends & hotspot maps',
              href: '/analytics',
              icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
              bg: 'bg-emerald-50 hover:bg-emerald-100',
            },
            {
              label: 'Court Deadlines',
              desc: 'Pending chargesheet filings',
              href: '/cases',
              icon: <Clock className="h-5 w-5 text-red-600" />,
              bg: 'bg-red-50 hover:bg-red-100',
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-start gap-4 p-4 rounded-xl border border-border transition-all duration-150 group ${action.bg}`}
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary-700 transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-secondary mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
