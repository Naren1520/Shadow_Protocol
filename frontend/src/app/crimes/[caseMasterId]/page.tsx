'use client';

import React from 'react';
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

// Mock data — replace with API call
const FIR_DETAIL = {
  caseMasterId: 1,
  crimeNo: '10443000620260041',
  caseNo: '440000620260041',
  crimeRegisteredDate: '2026-07-24T09:32:00',
  station: 'Cubbon Park Police Station',
  district: 'Bengaluru Urban',
  officer: 'Sub-Inspector K. Ramesh',
  category: 'FIR',
  gravity: 'Heinous',
  majorHead: 'Crimes Against Property',
  minorHead: 'Robbery',
  status: 'Open',
  court: 'Additional Chief Metropolitan Magistrate Court',
  incidentFrom: '2026-07-24T02:15:00',
  incidentTo: '2026-07-24T02:45:00',
  latitude: 12.9716,
  longitude: 77.5946,
  briefFacts:
    'The complainant reported that on 24-07-2026 at approximately 02:15 hrs, two unidentified persons on a motorcycle approached him near Cubbon Park main gate and snatched his mobile phone and wallet containing cash Rs.4500/- and identity documents. The accused fled on the motorcycle towards MG Road direction.',
  acts: [
    { actCode: 'IPC', sectionCode: '392', description: 'Robbery' },
    { actCode: 'IPC', sectionCode: '397', description: 'Robbery with attempt to cause death or grievous hurt' },
  ],
  complainants: [
    { name: 'Aravind Sharma', age: 34, gender: 'Male', occupation: 'Software Engineer' },
  ],
  victims: [
    { name: 'Aravind Sharma', age: 34, gender: 'Male' },
  ],
  accused: [
    { personId: 'A1', name: 'Unknown', age: null, gender: 'Male', status: 'Absconding' },
    { personId: 'A2', name: 'Unknown', age: null, gender: 'Male', status: 'Absconding' },
  ],
  arrests: [],
};

interface Props {
  params: Promise<{ caseMasterId: string }>;
}

export default function CrimeDetailPage({ params }: Props) {
  const { caseMasterId } = React.use(params);
  void caseMasterId; // TODO: use to fetch from API — for now using mock data
  const fir = FIR_DETAIL;

  return (
    <AppShell>
      <div className="space-y-5 max-w-5xl">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/crimes"
            className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
          >
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

        {/* FIR Header Card */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground font-mono">{fir.crimeNo}</h1>
                <Badge variant={fir.gravity === 'Heinous' ? 'danger' : 'neutral'} dot>
                  {fir.gravity}
                </Badge>
                <Badge variant="danger" dot>{fir.status}</Badge>
                <Badge variant="info">{fir.category}</Badge>
              </div>
              <p className="text-sm text-secondary">
                Case No: <span className="font-medium font-mono">{fir.caseNo}</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                {[
                  { icon: <Building2 className="h-3.5 w-3.5" />, label: fir.station },
                  { icon: <MapPin className="h-3.5 w-3.5" />, label: fir.district },
                  { icon: <Calendar className="h-3.5 w-3.5" />, label: new Date(fir.crimeRegisteredDate).toLocaleString('en-IN') },
                  { icon: <User className="h-3.5 w-3.5" />, label: fir.officer },
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
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Brief Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Brief Facts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{fir.briefFacts}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Incident From</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                      {new Date(fir.incidentFrom).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Incident To</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                      {new Date(fir.incidentTo).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acts & Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Acts & Sections</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fir.acts.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {act.actCode} § {act.sectionCode}
                        </p>
                        <p className="text-xs text-secondary mt-0.5">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accused */}
            <Card>
              <CardHeader>
                <CardTitle>Accused ({fir.accused.length})</CardTitle>
                <Badge variant="neutral">{fir.accused.length} persons</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fir.accused.map((acc) => (
                    <div key={acc.personId} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-600">{acc.personId}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {acc.name}
                          {acc.age ? `, ${acc.age}` : ''}
                        </p>
                        <p className="text-xs text-secondary">{acc.gender}</p>
                      </div>
                      <Badge variant="warning">{acc.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Case Details */}
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {[
                    { label: 'Major Head', value: fir.majorHead },
                    { label: 'Minor Head', value: fir.minorHead },
                    { label: 'Category', value: fir.category },
                    { label: 'Court', value: fir.court },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Complainants */}
            <Card>
              <CardHeader>
                <CardTitle>Complainants</CardTitle>
              </CardHeader>
              <CardContent>
                {fir.complainants.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-muted rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}, {c.age}</p>
                      <p className="text-xs text-secondary">{c.occupation} · {c.gender}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location */}
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
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Map view — integrate React Leaflet here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
