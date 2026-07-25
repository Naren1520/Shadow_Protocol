'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input, Select } from '@/shared/components/ui/input';
import {
  Search,
  Briefcase,
  Calendar,
  User,
  Clock,
  Eye,
  Filter,
  Scale,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { caseService } from '@/modules/cases/services/case-service';

const statusBadge = (s: string) => {
  if (s === 'Open') return <Badge variant="danger" dot>{s}</Badge>;
  if (s === 'Under Investigation') return <Badge variant="warning" dot>{s}</Badge>;
  if (s === 'Chargesheet Filed') return <Badge variant="info" dot>{s}</Badge>;
  if (s === 'Pending Trial') return <Badge variant="purple" dot>{s}</Badge>;
  if (s === 'Closed') return <Badge variant="success" dot>{s}</Badge>;
  return <Badge variant="neutral">{s}</Badge>;
};

const statusIdMap: Record<string, number | undefined> = {
  '': undefined,
  Open: 1,
  'Under Investigation': 2,
  Charged: 3,
  Arrested: 4,
};

export default function CasesPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await caseService.getCases({
          ...(query.trim() ? { caseNo: query.trim() } : {}),
          ...(query.trim() ? { crimeNo: query.trim() } : {}),
          ...(statusFilter ? { caseStatusId: statusIdMap[statusFilter] } : {}),
        });
        setCases(response.data?.data || []);
      } catch (err) {
        setError('Unable to load cases from the backend.');
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadCases, 250);
    return () => window.clearTimeout(timeout);
  }, [query, statusFilter]);

  const filtered = cases.filter((c) => {
    const searchText = `${c.crimeNo || ''} ${c.caseNo || ''} ${c.majorHead?.crimeGroupName || ''} ${c.registeredBy?.firstName || ''}`.toLowerCase();
    const matchQuery = !query || searchText.includes(query.toLowerCase());
    const matchStatus = !statusFilter || (c.caseStatus?.caseStatusName || '') === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalCases = cases.length;
  const activeCases = cases.filter((c) => ['Open', 'Under Investigation'].includes(c.caseStatus?.caseStatusName || '')).length;
  const chargesheetDueCount = cases.filter((c) => c.chargesheet?.chargeshtDate).length;
  const pendingTrialCount = cases.filter((c) => (c.caseStatus?.caseStatusName || '') === 'Pending Trial').length;

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Case Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track investigations, court proceedings, and chargesheets</p>
          </div>
          <Button size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />} variant="outline" onClick={() => setShowFilters((v) => !v)}>
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Cases', value: totalCases, color: 'bg-slate-50 text-foreground' },
            { label: 'Open / Active', value: activeCases, color: 'bg-amber-50 text-amber-700' },
            { label: 'Chargesheets Available', value: chargesheetDueCount, color: 'bg-red-50 text-red-700' },
            { label: 'Pending Trial', value: pendingTrialCount, color: 'bg-purple-50 text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-border p-4 ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by case no., crime no., officer..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            {showFilters && (
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Under Investigation', label: 'Under Investigation' },
                  { value: 'Charged', label: 'Charged' },
                  { value: 'Arrested', label: 'Arrested' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            )}
          </div>
        </Card>

        <div className="space-y-3">
          {error ? (
            <Card className="py-12 text-center text-sm text-muted-foreground">{error}</Card>
          ) : loading ? (
            <Card className="py-12 text-center text-sm text-muted-foreground">Loading cases from the backend…</Card>
          ) : filtered.length === 0 ? (
            <Card className="py-12 text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground">No cases match your search.</p>
            </Card>
          ) : (
            filtered.map((c) => {
              const status = c.caseStatus?.caseStatusName || 'N/A';
              const officerName = c.registeredBy ? `${c.registeredBy.rank?.rankName || ''} ${c.registeredBy.firstName || ''}`.trim() : 'N/A';
              const courtName = c.court?.courtName || 'N/A';
              const registered = c.crimeRegisteredDate ? new Date(c.crimeRegisteredDate).toLocaleDateString('en-IN') : 'N/A';
              const daysOpen = c.crimeRegisteredDate ? Math.max(0, Math.floor((Date.now() - new Date(c.crimeRegisteredDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
              const chargesheetDue = c.chargesheet?.chargeshtDate ? new Date(c.chargesheet.chargeshtDate).toLocaleDateString('en-IN') : null;

              return (
                <Card key={c.caseMasterId} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/crimes/${c.caseMasterId}`} className="font-mono text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                          {c.crimeNo}
                        </Link>
                        {statusBadge(status)}
                        {chargesheetDue && (
                          <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                            <AlertCircle className="h-3 w-3" />
                            Due {chargesheetDue}
                          </span>
                        )}
                      </div>
                      <p className="text-base font-semibold text-foreground">{c.majorHead?.crimeGroupName || 'N/A'}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {[
                          { icon: <User className="h-3.5 w-3.5" />, label: officerName },
                          { icon: <Scale className="h-3.5 w-3.5" />, label: courtName },
                          { icon: <Calendar className="h-3.5 w-3.5" />, label: `Registered: ${registered}` },
                          { icon: <Clock className="h-3.5 w-3.5" />, label: `${daysOpen} days open` },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-secondary">
                            {item.icon}
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link href={`/crimes/${c.caseMasterId}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                        View Case
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
