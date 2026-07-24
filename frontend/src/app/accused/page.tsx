'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Search, Users, Eye, Filter, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const ACCUSED_DATA = [
  {
    accusedMasterId: 1,
    personId: 'A1',
    accusedName: 'Ravi Kumar',
    ageYear: 28,
    gender: 'Male',
    caseNo: '440000620260001',
    crimeNo: '10443000620260001',
    crimeType: 'Robbery',
    status: 'Arrested',
    arrests: 3,
  },
  {
    accusedMasterId: 2,
    personId: 'A1',
    accusedName: 'Meena Devi',
    ageYear: 35,
    gender: 'Female',
    caseNo: '440000620260011',
    crimeNo: '10443000620260011',
    crimeType: 'Fraud',
    status: 'Absconding',
    arrests: 1,
  },
  {
    accusedMasterId: 3,
    personId: 'A2',
    accusedName: 'Suresh B.',
    ageYear: 42,
    gender: 'Male',
    caseNo: '440000620260015',
    crimeNo: '10443000620260015',
    crimeType: 'NDPS',
    status: 'In Custody',
    arrests: 5,
  },
  {
    accusedMasterId: 4,
    personId: 'A1',
    accusedName: 'Mohan Lal',
    ageYear: 31,
    gender: 'Male',
    caseNo: '440000620260020',
    crimeNo: '10443000620260020',
    crimeType: 'Theft',
    status: 'Released on Bail',
    arrests: 2,
  },
];

const statusBadge = (status: string) => {
  if (status === 'Arrested' || status === 'In Custody') return <Badge variant="success" dot>{status}</Badge>;
  if (status === 'Absconding') return <Badge variant="danger" dot>{status}</Badge>;
  if (status === 'Released on Bail') return <Badge variant="warning" dot>{status}</Badge>;
  return <Badge variant="neutral">{status}</Badge>;
};

export default function AccusedPage() {
  const [query, setQuery] = useState('');

  const filtered = ACCUSED_DATA.filter(
    (a) =>
      a.accusedName.toLowerCase().includes(query.toLowerCase()) ||
      a.personId.toLowerCase().includes(query.toLowerCase()) ||
      a.crimeNo.includes(query)
  );

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Accused Records</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} records · Linked to FIR cases
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
              Filters
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Accused', value: ACCUSED_DATA.length, color: 'text-foreground', bg: 'bg-slate-50' },
            { label: 'In Custody', value: ACCUSED_DATA.filter(a => a.status === 'In Custody' || a.status === 'Arrested').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Absconding', value: ACCUSED_DATA.filter(a => a.status === 'Absconding').length, color: 'text-red-700', bg: 'bg-red-50' },
            { label: 'Out on Bail', value: ACCUSED_DATA.filter(a => a.status === 'Released on Bail').length, color: 'text-amber-700', bg: 'bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-border p-4 ${s.bg}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <Card className="p-4">
          <Input
            placeholder="Search by name, accused ID, or crime number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Table */}
        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              Accused Records{' '}
              <span className="text-muted-foreground font-normal">({filtered.length})</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  {['ID', 'Name', 'Age', 'Gender', 'Crime No.', 'Offence', 'Prior Arrests', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No accused records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((acc) => (
                    <tr key={acc.accusedMasterId} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-semibold">
                          {acc.personId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground">{acc.accusedName}</td>
                      <td className="px-4 py-3.5 text-secondary">{acc.ageYear}</td>
                      <td className="px-4 py-3.5 text-secondary">{acc.gender}</td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/crimes/${acc.accusedMasterId}`}
                          className="font-mono text-xs text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {acc.crimeNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-secondary">{acc.crimeType}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {acc.arrests > 2 && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                          <span className={`text-sm font-semibold ${acc.arrests > 2 ? 'text-amber-600' : 'text-foreground'}`}>
                            {acc.arrests}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(acc.status)}</td>
                      <td className="px-4 py-3.5">
                        <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
