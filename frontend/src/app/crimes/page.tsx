'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input, Select } from '@/shared/components/ui/input';
import {
  Search,
  Plus,
  Filter,
  Download,
  FileText,
  Building2,
  Calendar,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_CRIMES = [
  {
    caseMasterId: 1,
    crimeNo: '10443000620260041',
    caseNo: '440000620260041',
    crimeRegisteredDate: '2026-07-24',
    policeStationId: 6,
    stationName: 'Cubbon Park PS',
    caseStatusId: 1,
    statusName: 'Open',
    crimeType: 'Robbery',
    gravity: 'Heinous',
    district: 'Bengaluru Urban',
  },
  {
    caseMasterId: 2,
    crimeNo: '10443000620260040',
    caseNo: '440000620260040',
    crimeRegisteredDate: '2026-07-23',
    policeStationId: 7,
    stationName: 'Shivajinagar PS',
    caseStatusId: 2,
    statusName: 'Under Investigation',
    crimeType: 'Assault',
    gravity: 'Non-Heinous',
    district: 'Bengaluru Urban',
  },
  {
    caseMasterId: 3,
    crimeNo: '10443000620260039',
    caseNo: '440000620260039',
    crimeRegisteredDate: '2026-07-23',
    policeStationId: 8,
    stationName: 'Indiranagar PS',
    caseStatusId: 3,
    statusName: 'Charged',
    crimeType: 'Theft',
    gravity: 'Non-Heinous',
    district: 'Bengaluru Urban',
  },
  {
    caseMasterId: 4,
    crimeNo: '10443000620260038',
    caseNo: '440000620260038',
    crimeRegisteredDate: '2026-07-22',
    policeStationId: 9,
    stationName: 'Banashankari PS',
    caseStatusId: 4,
    statusName: 'Arrested',
    crimeType: 'NDPS Act',
    gravity: 'Heinous',
    district: 'Bengaluru Urban',
  },
  {
    caseMasterId: 5,
    crimeNo: '10443000620260037',
    caseNo: '440000620260037',
    crimeRegisteredDate: '2026-07-22',
    policeStationId: 10,
    stationName: 'Malleswaram PS',
    caseStatusId: 1,
    statusName: 'Open',
    crimeType: 'Dacoity',
    gravity: 'Heinous',
    district: 'Bengaluru Urban',
  },
  {
    caseMasterId: 6,
    crimeNo: '20329000120260020',
    caseNo: '329000120260020',
    crimeRegisteredDate: '2026-07-21',
    policeStationId: 12,
    stationName: 'Mysuru North PS',
    caseStatusId: 2,
    statusName: 'Under Investigation',
    crimeType: 'Murder',
    gravity: 'Heinous',
    district: 'Mysuru',
  },
];

const statusBadgeMap: Record<string, React.ReactNode> = {
  Open: <Badge variant="danger" dot>Open</Badge>,
  'Under Investigation': <Badge variant="warning" dot>Under Investigation</Badge>,
  Charged: <Badge variant="info" dot>Charged</Badge>,
  Arrested: <Badge variant="success" dot>Arrested</Badge>,
};

const gravityBadgeMap: Record<string, React.ReactNode> = {
  Heinous: <Badge variant="danger">Heinous</Badge>,
  'Non-Heinous': <Badge variant="neutral">Non-Heinous</Badge>,
};

export default function CrimeListPage() {
  const [crimeNo, setCrimeNo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 10;

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const crimes = MOCK_CRIMES;
  const filtered = statusFilter
    ? crimes.filter((c) => c.statusName === statusFilter)
    : crimes;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">FIR Records</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length.toLocaleString()} records · Karnataka Police FIR System
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export
            </Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Register FIR
            </Button>
          </div>
        </div>

        {/* Search & Filter bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by Crime No. (e.g. 10443000620260001)"
                value={crimeNo}
                onChange={(e) => setCrimeNo(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setShowFilters((v) => !v)}
              >
                Filters
              </Button>
              <Button
                isLoading={loading}
                leftIcon={<Search className="h-4 w-4" />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border grid gap-3 sm:grid-cols-3 animate-slide-up">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Under Investigation', label: 'Under Investigation' },
                  { value: 'Charged', label: 'Charged' },
                  { value: 'Arrested', label: 'Arrested' },
                ]}
              />
              <Input label="From Date" type="date" />
              <Input label="To Date" type="date" />
            </div>
          )}
        </Card>

        {/* Table */}
        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Results{' '}
              <span className="text-muted-foreground font-normal">
                ({filtered.length} records)
              </span>
            </h3>
            <button
              onClick={handleSearch}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    {['Crime No.', 'Type', 'Gravity', 'Station', 'District', 'Date', 'Status', ''].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        No FIR records found. Try adjusting your search.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((crime) => (
                      <tr key={crime.caseMasterId} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/crimes/${crime.caseMasterId}`}
                            className="font-mono text-xs text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {crime.crimeNo}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground">{crime.crimeType}</td>
                        <td className="px-4 py-3.5">{gravityBadgeMap[crime.gravity] ?? <Badge variant="neutral">{crime.gravity}</Badge>}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-sm">{crime.stationName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-secondary">{crime.district}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-sm">{new Date(crime.crimeRegisteredDate).toLocaleDateString('en-IN')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {statusBadgeMap[crime.statusName] ?? (
                            <Badge variant="neutral">{crime.statusName}</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={`/crimes/${crime.caseMasterId}`}>
                            <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3.5 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
