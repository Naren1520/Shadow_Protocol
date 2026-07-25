'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  Building2,
  User,
  Scale,
  BookOpen,
  Clock,
  Printer,
  Download,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { crimeService } from '@/modules/crimes/services/crime-service';

interface Props {
  params: Promise<{ caseMasterId: string }>;
}

export default function CrimeDetailPage({ params }: Props) {
  const { caseMasterId } = React.use(params);
  const [fir, setFir] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCrime = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await crimeService.getCrimeDetails(Number(caseMasterId));
        setFir(response.data?.data || null);
      } catch (err) {
        setError('Unable to load FIR details from the backend.');
        setFir(null);
      } finally {
        setLoading(false);
      }
    };

    if (caseMasterId) {
      void loadCrime();
    }
  }, [caseMasterId]);

  const stationName = fir?.policeStation?.unitName || 'N/A';
  const districtName = fir?.policeStation?.districtName || fir?.district || 'N/A';
  const officerName = fir?.registeredBy ? `${fir.registeredBy.rank?.rankName || ''} ${fir.registeredBy.firstName || ''}`.trim() : 'N/A';
  const gravity = fir?.gravityOffence?.lookupValue || 'N/A';
  const status = fir?.caseStatus?.caseStatusName || 'N/A';
  const category = fir?.caseCategory?.lookupValue || 'N/A';
  const majorHead = fir?.majorHead?.crimeGroupName || 'N/A';
  const minorHead = fir?.minorHead?.crimeHeadName || 'N/A';
  const courtName = fir?.court?.courtName || 'N/A';
  const acts = fir?.actSections || [];
  const complainants = fir?.complainants || [];
  const accused = fir?.accused || [];

  return (
    <AppShell>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href="/crimes" className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to FIR Records
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Printer className="h-3.5 w-3.5" />}>
              Print FIR
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export PDF
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="p-6 text-sm text-muted-foreground">{error}</Card>
        ) : loading ? (
          <Card className="p-6 text-sm text-muted-foreground">Loading FIR details from the backend…</Card>
        ) : !fir ? (
          <Card className="p-6 text-sm text-muted-foreground">No FIR details were returned by the backend.</Card>
        ) : (
          <>
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-foreground font-mono">{fir.crimeNo}</h1>
                    <Badge variant={gravity === 'Heinous' ? 'danger' : 'neutral'} dot>
                      {gravity}
                    </Badge>
                    <Badge variant="danger" dot>{status}</Badge>
                    <Badge variant="info">{category}</Badge>
                  </div>
                  <p className="text-sm text-secondary">
                    Case No: <span className="font-medium font-mono">{fir.caseNo}</span>
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    {[
                      { icon: <Building2 className="h-3.5 w-3.5" />, label: stationName },
                      { icon: <MapPin className="h-3.5 w-3.5" />, label: districtName },
                      { icon: <Calendar className="h-3.5 w-3.5" />, label: fir.crimeRegisteredDate ? new Date(fir.crimeRegisteredDate).toLocaleString('en-IN') : 'N/A' },
                      { icon: <User className="h-3.5 w-3.5" />, label: officerName },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-secondary">
                        {item.icon}
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Brief Facts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground leading-relaxed">{fir.briefFacts || 'No brief facts were returned by the backend.'}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Incident From</p>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <Clock className="h-3.5 w-3.5 text-secondary" />
                          {fir.incidentFromDate ? new Date(fir.incidentFromDate).toLocaleString('en-IN') : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Incident To</p>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <Clock className="h-3.5 w-3.5 text-secondary" />
                          {fir.incidentToDate ? new Date(fir.incidentToDate).toLocaleString('en-IN') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Acts & Sections</CardTitle>
                    <Scale className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {acts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No act/section data returned by the backend.</p>
                      ) : acts.map((act: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-4 w-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {act.act?.actCode || 'N/A'} § {act.section?.sectionCode || 'N/A'}
                            </p>
                            <p className="text-xs text-secondary mt-0.5">{act.act?.actDescription || act.section?.sectionDescription || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accused ({accused.length})</CardTitle>
                    <Badge variant="neutral">{accused.length} persons</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {accused.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No accused persons were returned.</p>
                      ) : accused.map((acc: any) => (
                        <div key={acc.accusedMasterId} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-red-600">{acc.personId || acc.accusedMasterId}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {acc.accusedName || 'Unknown'}
                              {acc.ageYear ? `, ${acc.ageYear}` : ''}
                            </p>
                            <p className="text-xs text-secondary">{acc.genderId ? `Gender ID ${acc.genderId}` : 'Gender not available'}</p>
                          </div>
                          <Badge variant="warning">{acc.status || 'N/A'}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3">
                      {[
                        { label: 'Major Head', value: majorHead },
                        { label: 'Minor Head', value: minorHead },
                        { label: 'Category', value: category },
                        { label: 'Court', value: courtName },
                      ].map((item) => (
                        <div key={item.label}>
                          <dt className="text-xs text-muted-foreground">{item.label}</dt>
                          <dd className="text-sm font-medium text-foreground mt-0.5">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Complainants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {complainants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No complainants were returned.</p>
                    ) : complainants.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-muted rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.complainantName || 'Unknown'}{c.ageYear ? `, ${c.ageYear}` : ''}</p>
                          <p className="text-xs text-secondary">{c.occupation?.occupationName || 'Occupation not available'}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {fir.latitude && fir.longitude && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Location</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Coordinates</p>
                        <p className="text-sm font-mono font-medium text-foreground mt-0.5">
                          {fir.latitude}°N, {fir.longitude}°E
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">Map view — integrate React Leaflet here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
