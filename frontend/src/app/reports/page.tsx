'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { BookOpen, Download, Eye, Calendar, BarChart3, FileText, Users, Clock, MapPin } from 'lucide-react';

const REPORT_TEMPLATES = [
  {
    id: 1,
    name: 'Monthly Crime Statistics',
    desc: 'Comprehensive monthly FIR and case statistics by district',
    icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
    bg: 'bg-blue-50',
    category: 'Analytics',
    lastGenerated: '01 Jul 2026',
  },
  {
    id: 2,
    name: 'District-wise FIR Summary',
    desc: 'FIR counts, resolution rates, and pending cases per district',
    icon: <MapPin className="h-5 w-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
    category: 'Summary',
    lastGenerated: '15 Jul 2026',
  },
  {
    id: 3,
    name: 'Chargesheet Status Report',
    desc: 'Cases with pending and filed chargesheets, court-wise breakdown',
    icon: <FileText className="h-5 w-5 text-amber-600" />,
    bg: 'bg-amber-50',
    category: 'Legal',
    lastGenerated: '20 Jul 2026',
  },
  {
    id: 4,
    name: 'Accused & Arrest Report',
    desc: 'Arrest records, bail status, and repeat offender analysis',
    icon: <Users className="h-5 w-5 text-red-600" />,
    bg: 'bg-red-50',
    category: 'Arrests',
    lastGenerated: '22 Jul 2026',
  },
  {
    id: 5,
    name: 'Court Deadline Report',
    desc: 'Upcoming court hearings and chargesheet deadlines',
    icon: <Calendar className="h-5 w-5 text-purple-600" />,
    bg: 'bg-purple-50',
    category: 'Legal',
    lastGenerated: '24 Jul 2026',
  },
  {
    id: 6,
    name: 'Officer Performance Report',
    desc: 'Case load, detection rates, and resolution metrics per officer',
    icon: <Clock className="h-5 w-5 text-slate-600" />,
    bg: 'bg-slate-50',
    category: 'Performance',
    lastGenerated: '01 Jul 2026',
  },
];

const RECENT_REPORTS = [
  { name: 'Monthly Crime Statistics – June 2026', generated: '01 Jul 2026 09:00', by: 'Inspector P. Singh', size: '2.4 MB', format: 'PDF' },
  { name: 'Court Deadline Report – Week 29', generated: '18 Jul 2026 08:30', by: 'SI K. Ramesh', size: '680 KB', format: 'PDF' },
  { name: 'District-wise FIR Summary – Q2 2026', generated: '15 Jul 2026 11:15', by: 'SP Office', size: '5.1 MB', format: 'XLSX' },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<number | null>(null);

  const handleGenerate = (id: number) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Generate, schedule, and export intelligence reports
            </p>
          </div>
        </div>

        {/* Report templates */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Report Templates</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_TEMPLATES.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${t.bg}`}>
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <Badge variant="neutral" className="flex-shrink-0">{t.category}</Badge>
                    </div>
                    <p className="text-xs text-secondary mt-1">{t.desc}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last: {t.lastGenerated}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="xs"
                        isLoading={generating === t.id}
                        onClick={() => handleGenerate(t.id)}
                        leftIcon={<BookOpen className="h-3.5 w-3.5" />}
                      >
                        Generate
                      </Button>
                      <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recently Generated</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  {['Report Name', 'Generated By', 'Date & Time', 'Size', 'Format', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RECENT_REPORTS.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{r.name}</td>
                    <td className="px-5 py-3.5 text-secondary">{r.by}</td>
                    <td className="px-5 py-3.5 text-secondary text-xs font-mono">{r.generated}</td>
                    <td className="px-5 py-3.5 text-secondary">{r.size}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={r.format === 'PDF' ? 'danger' : 'success'}>{r.format}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Button variant="ghost" size="xs" leftIcon={<Download className="h-3.5 w-3.5" />}>
                        Download
                      </Button>
                    </td>
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
