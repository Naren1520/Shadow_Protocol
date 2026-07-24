'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Activity, Search, Download, Eye, Edit3, Trash2, LogIn } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 1, action: 'READ', resource: 'CrimeFIR', resourceId: '10443000620260041', user: 'SI K. Ramesh', ip: '192.168.1.10', time: '2026-07-24 09:35:12', kgId: 'KG-2021-04521' },
  { id: 2, action: 'CREATE', resource: 'CrimeFIR', resourceId: '10443000620260041', user: 'SI K. Ramesh', ip: '192.168.1.10', time: '2026-07-24 09:32:00', kgId: 'KG-2021-04521' },
  { id: 3, action: 'LOGIN', resource: 'Auth', resourceId: 'KG-2021-04521', user: 'SI K. Ramesh', ip: '192.168.1.10', time: '2026-07-24 09:30:45', kgId: 'KG-2021-04521' },
  { id: 4, action: 'UPDATE', resource: 'Accused', resourceId: 'ACC-0034', user: 'Inspector P. Singh', ip: '10.0.0.22', time: '2026-07-23 16:14:08', kgId: 'KG-2019-01234' },
  { id: 5, action: 'DELETE', resource: 'DraftFIR', resourceId: 'DRAFT-007', user: 'SI V. Reddy', ip: '10.0.0.31', time: '2026-07-23 14:02:55', kgId: 'KG-2020-03310' },
  { id: 6, action: 'READ', resource: 'ArrestRecord', resourceId: 'ARR-0021', user: 'Inspector M. Kaur', ip: '10.0.0.45', time: '2026-07-23 11:30:00', kgId: 'KG-2018-00542' },
  { id: 7, action: 'LOGIN', resource: 'Auth', resourceId: 'KG-2019-01234', user: 'Inspector P. Singh', ip: '10.0.0.22', time: '2026-07-23 08:45:20', kgId: 'KG-2019-01234' },
];

const actionConfig = {
  CREATE: { icon: <Edit3 className="h-3.5 w-3.5" />, badge: 'success' as const },
  READ: { icon: <Eye className="h-3.5 w-3.5" />, badge: 'info' as const },
  UPDATE: { icon: <Edit3 className="h-3.5 w-3.5" />, badge: 'warning' as const },
  DELETE: { icon: <Trash2 className="h-3.5 w-3.5" />, badge: 'danger' as const },
  LOGIN: { icon: <LogIn className="h-3.5 w-3.5" />, badge: 'neutral' as const },
};

export default function AuditLogsPage() {
  const [query, setQuery] = useState('');

  const filtered = AUDIT_LOGS.filter(
    (l) =>
      !query ||
      l.user.toLowerCase().includes(query.toLowerCase()) ||
      l.resource.toLowerCase().includes(query.toLowerCase()) ||
      l.resourceId.toLowerCase().includes(query.toLowerCase()) ||
      l.action.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit Logs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete audit trail of all system actions
            </p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(actionConfig).map(([action, cfg]) => (
            <div key={action} className="bg-card border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">
                {AUDIT_LOGS.filter(l => l.action === action).length}
              </p>
              <Badge variant={cfg.badge} className="mt-1">{action}</Badge>
            </div>
          ))}
        </div>

        <Card className="p-4">
          <Input
            placeholder="Search by user, resource, action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-foreground">
              Activity Log{' '}
              <span className="text-muted-foreground font-normal">({filtered.length} entries)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  {['Timestamp', 'User', 'KG ID', 'Action', 'Resource', 'Resource ID', 'IP Address'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((log) => {
                  const cfg = actionConfig[log.action as keyof typeof actionConfig];
                  return (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-secondary whitespace-nowrap">{log.time}</td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{log.user}</td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">{log.kgId}</td>
                      <td className="px-4 py-3">
                        <Badge variant={cfg.badge}>
                          <span className="flex items-center gap-1">{cfg.icon}{log.action}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-secondary">{log.resource}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary-600">{log.resourceId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">{log.ip}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
