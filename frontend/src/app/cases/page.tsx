'use client';

import React, { useState } from 'react';
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

const CASES_DATA = [
  {
    caseMasterId: 1,
    crimeNo: '10443000620260041',
    caseNo: '440000620260041',
    crimeType: 'Robbery',
    status: 'Open',
    investigatingOfficer: 'SI K. Ramesh',
    station: 'Cubbon Park PS',
    court: 'ACMM Court',
    registered: '24 Jul 2026',
    lastUpdated: '24 Jul 2026',
    daysOpen: 0,
    accused: 2,
    chargesheetDue: null,
  },
  {
    caseMasterId: 2,
    crimeNo: '10443000620260025',
    caseNo: '440000620260025',
    crimeType: 'Murder',
    status: 'Chargesheet Filed',
    investigatingOfficer: 'Inspector P. Singh',
    station: 'Shivajinagar PS',
    court: 'Session Court',
    registered: '10 Jun 2026',
    lastUpdated: '20 Jul 2026',
    daysOpen: 44,
    accused: 1,
    chargesheetDue: null,
  },
  {
    caseMasterId: 3,
    crimeNo: '10443000620260018',
    caseNo: '440000620260018',
    crimeType: 'NDPS',
    status: 'Under Investigation',
    investigatingOfficer: 'SI V. Reddy',
    station: 'Banashankari PS',
    court: 'Magistrate Court',
    registered: '01 May 2026',
    lastUpdated: '22 Jul 2026',
    daysOpen: 84,
    accused: 3,
    chargesheetDue: '30 Jul 2026',
  },
  {
    caseMasterId: 4,
    crimeNo: '10443000620260010',
    caseNo: '440000620260010',
    crimeType: 'Fraud',
    status: 'Pending Trial',
    investigatingOfficer: 'Inspector M. Kaur',
    station: 'Indiranagar PS',
    court: 'Additional Sessions Court',
    registered: '15 Mar 2026',
    lastUpdated: '18 Jul 2026',
    daysOpen: 131,
    accused: 2,
    chargesheetDue: null,
  },
];

const statusBadge = (s: string) => {
  if (s === 'Open') return <Badge variant="danger" dot>{s}</Badge>;
  if (s === 'Under Investigation') return <Badge variant="warning" dot>{s}</Badge>;
  if (s === 'Chargesheet Filed') return <Badge variant="info" dot>{s}</Badge>;
  if (s === 'Pending Trial') return <Badge variant="purple" dot>{s}</Badge>;
  if (s === 'Closed') return <Badge variant="success" dot>{s}</Badge>;
  return <Badge variant="neutral">{s}</Badge>;
};

export default function CasesPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = CASES_DATA.filter((c) => {
    const matchQuery =
      !query ||
      c.crimeNo.includes(query) ||
      c.caseNo.includes(query) ||
      c.crimeType.toLowerCase().includes(query.toLowerCase()) ||
      c.investigatingOfficer.toLowerCase().includes(query.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Case Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track investigations, court proceedings, and chargesheets
            </p>
          </div>
          <Button size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />} variant="outline" onClick={() => setShowFilters(v => !v)}>
            Filters
          </Button>
        </div>

        {/* Summary strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Cases', value: CASES_DATA.length, color: 'bg-slate-50 text-foreground' },
            { label: 'Open / Active', value: CASES_DATA.filter(c => c.status === 'Open' || c.status === 'Under Investigation').length, color: 'bg-amber-50 text-amber-700' },
            { label: 'Chargesheets Due', value: CASES_DATA.filter(c => c.chargesheetDue).length, color: 'bg-red-50 text-red-700' },
            { label: 'Pending Trial', value: CASES_DATA.filter(c => c.status === 'Pending Trial').length, color: 'bg-purple-50 text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-border p-4 ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
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
                  { value: 'Chargesheet Filed', label: 'Chargesheet Filed' },
                  { value: 'Pending Trial', label: 'Pending Trial' },
                  { value: 'Closed', label: 'Closed' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            )}
          </div>
        </Card>

        {/* Cases list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="py-12 text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground">No cases match your search.</p>
            </Card>
          ) : (
            filtered.map((c) => (
              <Card key={c.caseMasterId} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link
                        href={`/crimes/${c.caseMasterId}`}
                        className="font-mono text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {c.crimeNo}
                      </Link>
                      {statusBadge(c.status)}
                      {c.chargesheetDue && (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                          <AlertCircle className="h-3 w-3" />
                          Due {c.chargesheetDue}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-foreground">{c.crimeType}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {[
                        { icon: <User className="h-3.5 w-3.5" />, label: c.investigatingOfficer },
                        { icon: <Scale className="h-3.5 w-3.5" />, label: c.court },
                        { icon: <Calendar className="h-3.5 w-3.5" />, label: `Registered: ${c.registered}` },
                        { icon: <Clock className="h-3.5 w-3.5" />, label: `${c.daysOpen} days open` },
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
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
