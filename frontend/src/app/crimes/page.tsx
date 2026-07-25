'use client';

import React, { useEffect, useState } from 'react';
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
import { crimeService } from '@/modules/crimes/services/crime-service';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedCrimeNo, setAppliedCrimeNo] = useState('');
  const [crimes, setCrimes] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    const loadCrimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const statusId = statusFilter ? Number(statusFilter) : undefined;
        const response = await crimeService.searchCrimes({
          page,
          limit: PER_PAGE,
          ...(appliedCrimeNo ? { crimeNo: appliedCrimeNo } : {}),
          ...(statusId ? { caseStatusId: statusId } : {}),
        });

        const payload = response.data;
        setCrimes(payload?.data || []);
        setTotalRecords(payload?.pagination?.total || 0);
        setTotalPages(payload?.pagination?.totalPages || 1);
      } catch (err) {
        setError('Unable to load FIR records from the backend.');
        setCrimes([]);
        setTotalRecords(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    void loadCrimes();
  }, [appliedCrimeNo, page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    setAppliedCrimeNo(crimeNo.trim());
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">FIR Records</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalRecords.toLocaleString()} records · Karnataka Police FIR System
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
                  { value: '1', label: 'Open' },
                  { value: '2', label: 'Under Investigation' },
                  { value: '3', label: 'Charged' },
                  { value: '4', label: 'Arrested' },
                ]}
              />
              <Input label="From Date" type="date" />
              <Input label="To Date" type="date" />
            </div>
          )}
        </Card>

        <Card noPadding className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Results{' '}
              <span className="text-muted-foreground font-normal">
                ({totalRecords} records)
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

          {error ? (
            <div className="px-6 py-10 text-sm text-muted-foreground">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    {['Crime No.', 'Type', 'Gravity', 'Station', 'District', 'Date', 'Status', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {crimes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        No FIR records found. Try adjusting your search.
                      </td>
                    </tr>
                  ) : (
                    crimes.map((crime) => (
                      <tr key={crime.caseMasterId} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <Link href={`/crimes/${crime.caseMasterId}`} className="font-mono text-xs text-primary-600 hover:text-primary-700 hover:underline">
                            {crime.crimeNo}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground">{crime.majorHead?.crimeGroupName || crime.caseCategory?.lookupValue || 'N/A'}</td>
                        <td className="px-4 py-3.5">{gravityBadgeMap[crime.gravityOffence?.lookupValue] ?? <Badge variant="neutral">{crime.gravityOffence?.lookupValue || 'N/A'}</Badge>}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-sm">{crime.policeStation?.unitName || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-secondary">{crime.policeStation?.districtName || 'N/A'}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-sm">{crime.crimeRegisteredDate ? new Date(crime.crimeRegisteredDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {statusBadgeMap[crime.caseStatus?.caseStatusName] ?? <Badge variant="neutral">{crime.caseStatus?.caseStatusName || 'N/A'}</Badge>}
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

          {totalPages > 1 && (
            <div className="px-6 py-3.5 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
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
